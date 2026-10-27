import { getServerClient } from "@/lib/supabase/server";
import { type ContactMessage } from "@/lib/supabase/types";
import { Mail, Phone } from "lucide-react";
import { requireAdmin } from "@/lib/supabase/auth";

export const instant = false;

export default async function MessagesPage() {
  await requireAdmin();
  const supabase = getServerClient();
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading messages: {error.message}</div>;
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Contact Messages</h1>
        <p className="text-ink-3 text-[14px] mt-1">{messages?.length ?? 0} total enquiries</p>
      </div>

      {messages?.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-ink-3 text-[15px]">
          No messages yet. They&apos;ll appear here when someone submits the contact form.
        </div>
      )}

      <div className="space-y-4">
        {(messages as unknown as ContactMessage[]).map((msg) => (
          <div key={msg.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-[17px] font-bold text-ink">{msg.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <a href={`mailto:${msg.email}`} className="flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-purple-mid transition">
                    <Mail className="w-3.5 h-3.5" /> {msg.email}
                  </a>
                  {msg.phone && (
                    <a href={`tel:${msg.phone}`} className="flex items-center gap-1.5 text-[13px] text-ink-3 hover:text-purple-mid transition">
                      <Phone className="w-3.5 h-3.5" /> {msg.phone}
                    </a>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {msg.service && (
                  <span className="inline-flex items-center h-7 px-3 rounded-full bg-plum-50 border border-plum-100 text-[12px] font-semibold text-purple-mid">
                    {msg.service}
                  </span>
                )}
                <span className="text-[12px] text-ink-3">
                  {new Date(msg.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
            <p className="text-[14px] text-ink-2 leading-relaxed bg-sand rounded-xl px-4 py-3">
              {msg.message}
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href={`mailto:${msg.email}?subject=Re: Your enquiry with Olubor Ventures`}
                className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-purple-mid text-white text-[13px] font-semibold hover:bg-purple transition"
              >
                <Mail className="w-3.5 h-3.5" /> Reply by email
              </a>
              {msg.phone && (
                <a
                  href={`https://wa.me/${msg.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-8 px-4 rounded-lg bg-emerald-600 text-white text-[13px] font-semibold hover:bg-emerald-700 transition"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
