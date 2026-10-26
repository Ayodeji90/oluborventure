import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getServerClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
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

  const { name, email, phone, service, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json({ error: "Name, email and message are required." }, { status: 400 });
  }

  const supabase = getServerClient();

  // Save to database
  const { error: dbError } = await supabase.from("contact_messages").insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    service: service || null,
    message: message.trim(),
  });

  if (dbError) {
    console.error("[contact] db insert failed", dbError);
    return NextResponse.json({ error: "Could not save your message. Please try again." }, { status: 500 });
  }

  // Send email notification — fire and forget, don't fail the request if email fails
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL ?? "info@oluborconsults.com";
  if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("PASTE")) {
    resend.emails.send({
      from: "Olubor Website <noreply@oluborconsults.com>",
      to: notifyEmail,
      subject: `New enquiry from ${name.trim()} — ${service ?? "General"}`,
      text: [
        `Name: ${name.trim()}`,
        `Email: ${email.trim()}`,
        `Phone: ${phone?.trim() || "—"}`,
        `Service: ${service ?? "—"}`,
        ``,
        `Message:`,
        message.trim(),
        ``,
        `---`,
        `View in dashboard: https://oluborconsults.com/admin`,
      ].join("\n"),
    }).catch((err) => console.error("[contact] email send failed", err));
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
