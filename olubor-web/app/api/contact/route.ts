import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerClient } from "@/lib/supabase/server";

const SERVICE_OPTIONS = new Set([
  "Study Abroad", "Scholarships", "Visa Assistance", "International Jobs",
  "Canada Processing", "French Tutoring", "Flight Booking", "Other",
]);

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

  const cleanName = name.trim();
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
      subject: `New enquiry from ${name.trim()} — ${service ?? "General"}`,
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
