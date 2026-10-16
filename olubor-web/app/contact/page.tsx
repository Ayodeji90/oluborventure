"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

const inputCls =
  "w-full px-4 py-3 min-h-[48px] rounded-lg border border-gray-300 bg-white text-[15px] text-ink focus:border-purple focus:ring-2 focus:ring-purple/20 outline-none transition";
const labelCls = "block text-sm font-semibold text-ink mb-2";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Later: POST to Appwrite DB + notify team. Show confirmation now.
    setSent(true);
  };

  return (
    <>
      <PageHeader
        crumb="Contact"
        title="Talk to a counselor."
        description="Send a message, or call. Either way you get a human within one working day."
      />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.3fr] gap-16">
          <div className="space-y-8">
            <div>
              <h3 className="text-kicker text-ink-3 mb-3">Direct</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3"><Phone className="w-4 h-4 text-purple shrink-0" /><span className="text-ink">+234 XXX XXX XXXX</span></li>
                <li className="flex items-center gap-3"><Mail className="w-4 h-4 text-purple shrink-0" /><span className="text-ink">info@oluborventures.com</span></li>
                <li className="flex items-center gap-3"><MapPin className="w-4 h-4 text-purple shrink-0" /><span className="text-ink">Lagos, Nigeria</span></li>
              </ul>
            </div>
            <div>
              <h3 className="text-kicker text-ink-3 mb-3">Office hours</h3>
              <p className="text-ink-2 text-[15px] leading-relaxed">
                Monday – Friday: 9am – 5pm WAT<br />
                Saturday: 10am – 2pm WAT
              </p>
            </div>
            <div className="border-t-2 border-purple pt-6">
              <h3 className="text-lg font-bold text-ink mb-2">What happens after you write</h3>
              <p className="text-ink-2 text-[15px] leading-relaxed">
                A counselor reads your message, then calls or replies with
                initial options and the next available consultation slot. No
                sales scripts, no obligations.
              </p>
            </div>
          </div>

          <div>
            {sent ? (
              <div className="border border-gray-200 rounded-xl p-10 text-left max-w-xl">
                <div className="w-10 h-10 bg-plum-100 rounded-lg flex items-center justify-center mb-4 text-purple font-bold">✓</div>
                <h3 className="text-xl font-bold text-ink mb-2">Message received.</h3>
                <p className="text-ink-2 text-[15px] leading-relaxed mb-6">
                  We&apos;ll reply within one working day. If it&apos;s urgent, call the number above.
                </p>
                <button onClick={() => setSent(false)} className="text-purple font-semibold text-[15px] hover:underline underline-offset-4">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="c-name" className={labelCls}>Full name</label>
                    <input id="c-name" required type="text" placeholder="Your name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="c-phone" className={labelCls}>Phone / WhatsApp</label>
                    <input id="c-phone" type="tel" placeholder="+234 …" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label htmlFor="c-email" className={labelCls}>Email</label>
                  <input id="c-email" required type="email" placeholder="your@email.com" className={inputCls} />
                </div>
                <div>
                  <span className={labelCls}>Service</span>
                  <div className="flex flex-wrap gap-2">
                    {["Study Abroad", "Scholarships", "Visa Assistance", "International Jobs", "Other"].map((s) => (
                      <label key={s} className="cursor-pointer">
                        <input type="radio" name="service" value={s} className="peer sr-only" required />
                        <span className="inline-block px-4 min-h-[44px] leading-[44px] rounded-lg border border-gray-300 text-sm text-ink-2 peer-checked:bg-purple peer-checked:text-white peer-checked:border-purple hover:border-purple transition">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label htmlFor="c-msg" className={labelCls}>Message</label>
                  <textarea id="c-msg" required rows={5} placeholder="Tell us about your goals…" className={`${inputCls} h-auto`} />
                </div>
                <button type="submit" className="w-full sm:w-auto min-h-[52px] px-8 bg-purple text-white font-semibold rounded-lg hover:bg-purple-mid transition inline-flex items-center gap-2">
                  Send message <ArrowRight className="w-4 h-4" />
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
