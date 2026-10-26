"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight, Check } from "lucide-react";
import WhatsAppButton from "@/components/WhatsAppButton";

const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-xl border border-plum-100 bg-white text-[15px] text-ink " +
  "focus:border-purple-mid focus:ring-2 focus:ring-purple-mid/20 outline-none transition placeholder:text-ink-3";
const labelCls = "block text-sm font-semibold text-ink mb-1.5";

const services = [
  "Study Abroad",
  "Scholarships",
  "Visa Assistance",
  "International Jobs",
  "Canada Processing",
  "French Tutoring",
  "Flight Booking",
  "Other",
];

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        service: fd.get("service"),
        message: fd.get("message"),
      }),
    });
    if (res.ok) {
      setSent(true);
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-purple pt-40 pb-20 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-kicker text-amber mb-4">Get in touch</p>
          <h1 className="font-statement text-white text-[clamp(2rem,4vw,3.25rem)] font-bold leading-[1.1] mb-5 max-w-2xl">
            Talk to a counselor. No scripts, no pressure.
          </h1>
          <p className="text-white/65 text-lg max-w-xl leading-relaxed">
            Send a message or call directly — a real person gets back to you within one working day.
          </p>
        </div>
      </section>

      {/* ── Main ─────────────────────────────────────────────────── */}
      <section className="py-20 px-4 bg-sand">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">

          {/* Left: contact info */}
          <div className="space-y-6">
            {/* Direct contact */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <h3 className="text-[11px] font-bold tracking-widest uppercase text-ink-3 mb-5">Reach us directly</h3>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+447404662298" className="flex items-center gap-3.5 group">
                    <div className="w-9 h-9 rounded-xl bg-plum-50 border border-plum-100 flex items-center justify-center shrink-0">
                      <Phone className="w-4 h-4 text-purple-mid" />
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-3 font-medium">Phone</p>
                      <p className="text-[15px] font-semibold text-ink group-hover:text-purple-mid transition">+44 7404 662298</p>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:info@oluborconsults.com" className="flex items-center gap-3.5 group">
                    <div className="w-9 h-9 rounded-xl bg-plum-50 border border-plum-100 flex items-center justify-center shrink-0">
                      <Mail className="w-4 h-4 text-purple-mid" />
                    </div>
                    <div>
                      <p className="text-[12px] text-ink-3 font-medium">Email</p>
                      <p className="text-[15px] font-semibold text-ink group-hover:text-purple-mid transition">info@oluborconsults.com</p>
                    </div>
                  </a>
                </li>
                <li className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-plum-50 border border-plum-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-purple-mid" />
                  </div>
                  <div>
                    <p className="text-[12px] text-ink-3 font-medium">Location</p>
                    <p className="text-[15px] font-semibold text-ink">Lagos, Nigeria</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl bg-plum-50 border border-plum-100 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-purple-mid" />
                </div>
                <h3 className="text-[11px] font-bold tracking-widest uppercase text-ink-3">Office hours</h3>
              </div>
              <div className="space-y-2 text-[14px]">
                <div className="flex justify-between">
                  <span className="text-ink-2">Monday – Friday</span>
                  <span className="font-semibold text-ink">9am – 5pm WAT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Saturday</span>
                  <span className="font-semibold text-ink">10am – 2pm WAT</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-2">Sunday</span>
                  <span className="font-semibold text-ink-3">Closed</span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-purple rounded-2xl p-7 text-white">
              <h3 className="font-semibold text-[16px] mb-4">What happens after you write</h3>
              <ul className="space-y-3 text-[14px] text-white/75">
                {[
                  "A counselor reads your message personally",
                  "We call or reply with initial options",
                  "We offer the next available consultation slot",
                  "No sales scripts, no obligations",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-amber shrink-0 mt-0.5" strokeWidth={2.5} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            {sent ? (
              <div className="flex flex-col items-center text-center py-8">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-5">
                  <Check className="w-8 h-8 text-emerald-500" strokeWidth={2.5} />
                </div>
                <h3 className="text-[22px] font-bold text-ink mb-2">Message received!</h3>
                <p className="text-ink-2 leading-relaxed mb-6 max-w-sm">
                  We&apos;ll reply within one working day. If it&apos;s urgent, call the number on the left.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="text-purple-mid font-semibold text-[14px] hover:underline underline-offset-4"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h2 className="text-[19px] font-bold text-ink mb-1">Send us a message</h2>
                  <p className="text-[14px] text-ink-3">We reply within one working day.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className={labelCls}>Full name <span className="text-red-500">*</span></label>
                    <input id="c-name" name="name" required type="text" placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className={labelCls}>Phone / WhatsApp</label>
                    <input id="c-phone" name="phone" type="tel" placeholder="+234 …" className={inputCls} />
                  </div>
                </div>

                <div>
                  <label htmlFor="c-email" className={labelCls}>Email address <span className="text-red-500">*</span></label>
                  <input id="c-email" name="email" required type="email" placeholder="your@email.com" className={inputCls} />
                </div>

                <div>
                  <label className={labelCls}>Which service are you interested in?</label>
                  <div className="flex flex-wrap gap-2">
                    {services.map((s) => (
                      <label key={s} className="cursor-pointer">
                        <input type="radio" name="service" value={s} className="peer sr-only" />
                        <span className="inline-flex items-center h-9 px-3.5 rounded-xl border border-plum-100 text-[13px] font-medium text-ink-2 cursor-pointer peer-checked:bg-purple-mid peer-checked:text-white peer-checked:border-purple-mid hover:border-purple-mid/50 transition">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-msg" className={labelCls}>Message <span className="text-red-500">*</span></label>
                  <textarea
                    id="c-msg"
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell us about your goals, timeline, or any questions you have…"
                    className={`${inputCls} h-auto resize-none`}
                  />
                </div>

                {error && (
                  <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 h-12 px-8 bg-purple-mid text-white font-semibold rounded-xl hover:bg-purple transition text-[15px] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending…" : <><span>Send message</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  );
}
