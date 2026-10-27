import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerClient } from "@/lib/supabase/server";

const SERVICE_OPTIONS = new Set([
  "Study Abroad", "Scholarships", "Visa Assistance", "International Jobs",
  "Canada Processing", "French Tutoring", "Flight Booking", "Other",
]);
const CONTACT_RATE_LIMIT = 5;
const CONTACT_RATE_WINDOW_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 12 * 1024) {
    return NextResponse.json({ error: "Message is too large." }, { status: 413 });
  }

  let body: {
    name?: string;
    email?: string;
    phone?: string;
    service?: string;
    message?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { name, email, phone, service, message } = body;
  if (
    typeof name !== "string" || typeof email !== "string" || typeof message !== "string" ||
    (phone !== undefined && phone !== null && typeof phone !== "string") ||
    (service !== undefined && service !== null && typeof service !== "string")
  ) {
    return NextResponse.json({ error: "Invalid message details." }, { status: 400 });
  }

  const cleanName = name.trim().replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ");
  const cleanEmail = email.trim().toLowerCase();
  const cleanPhone = typeof phone === "string" ? phone.trim() : "";
  const cleanService = typeof service === "string" ? service.trim() : "";
  const cleanMessage = message.trim();
  if (
    cleanName.length < 2 || cleanName.length > 160 || cleanEmail.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail) || cleanPhone.length > 40 ||
    cleanMessage.length < 3 || cleanMessage.length > 5000 ||
    (cleanService && !SERVICE_OPTIONS.has(cleanService))
  ) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const supabase = getServerClient();
  const forwardedFor = request.headers.get("x-forwarded-for");
  const clientIp = (
    request.headers.get("x-real-ip")?.trim() ||
    forwardedFor?.split(",").at(-1)?.trim() ||
    "unknown"
  ).slice(0, 128);
  const windowStartMs = Math.floor(Date.now() / CONTACT_RATE_WINDOW_MS) * CONTACT_RATE_WINDOW_MS;
  const rateLimitSecret = process.env.RATE_LIMIT_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!rateLimitSecret) {
    console.error("[contact] rate limit secret is not configured");
    return NextResponse.json({ error: "Contact service is temporarily unavailable." }, { status: 503 });
  }

  const bucketKey = createHmac("sha256", rateLimitSecret).update(clientIp).digest("hex");
  const { data: requestCount, error: rateLimitError } = await supabase.rpc(
    "consume_contact_rate_limit",
    { p_bucket_key: bucketKey, p_window_start: new Date(windowStartMs).toISOString() },
  );
  if (rateLimitError || typeof requestCount !== "number") {
    console.error("[contact] rate limit check failed", rateLimitError);
    return NextResponse.json({ error: "Contact service is temporarily unavailable." }, { status: 503 });
  }
  if (requestCount > CONTACT_RATE_LIMIT) {
    const retryAfter = Math.max(1, Math.ceil((windowStartMs + CONTACT_RATE_WINDOW_MS - Date.now()) / 1000));
    return NextResponse.json(
      { error: "Too many messages. Please try again later." },
      { status: 429, headers: { "Retry-After": String(retryAfter) } },
    );
  }

  // Save to database
  const { error: dbError } = await supabase.from("contact_messages").insert({
    name: cleanName,
    email: cleanEmail,
    phone: cleanPhone || null,
    service: cleanService || null,
    message: cleanMessage,
  });

  if (dbError) {
    console.error("[contact] db insert failed", dbError);
    return NextResponse.json({ error: "Could not save your message. Please try again." }, { status: 500 });
  }

  // Send email notification — fire and forget, don't fail the request if email fails
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL ?? "info@oluborconsults.com";
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("PASTE")) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails.send({
      from: "Olubor Website <noreply@oluborconsults.com>",
      to: notifyEmail,
      subject: `New enquiry from ${cleanName} — ${cleanService || "General"}`,
      text: [
        `Name: ${cleanName}`,
        `Email: ${cleanEmail}`,
        `Phone: ${cleanPhone || "—"}`,
        `Service: ${cleanService || "—"}`,
        ``,
        `Message:`,
        cleanMessage,
        ``,
        `---`,
        `View in dashboard: https://oluborconsults.com/admin`,
      ].join("\n"),
    }).catch((err) => console.error("[contact] email send failed", err));
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
