"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import WhatsAppButton from "@/components/WhatsAppButton";

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
        crumb="Contact Us"
        title="Get In Touch"
        description="Ready to start your journey? Send us a message and we'll respond within 24 hours."
      />
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            {[
              { Icon: MapPin, title: "Address", value: "Lagos, Nigeria" },
              { Icon: Mail, title: "Email", value: "info@oluborventures.com" },
              { Icon: Phone, title: "Phone / WhatsApp", value: "+234 XXX XXX XXXX" },
            ].map(({ Icon, title, value }) => (
              <div key={title} className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 gradient-bg rounded-full flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-purple">{title}</h4>
                  <p className="text-gray-600">{value}</p>
                </div>
              </div>
            ))}
            <div className="gradient-bg rounded-2xl p-8 text-white">
              <h4 className="text-xl font-bold mb-2">Office Hours</h4>
              <p className="opacity-90 text-sm">Mon – Fri: 9am – 5pm WAT<br />Sat: 10am – 2pm WAT</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100">
            {sent ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-purple mb-2">Message received!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-purple mb-2">Full Name</label>
                  <input required type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple mb-2">Email</label>
                  <input required type="email" placeholder="your@email.com" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple mb-2">Phone / WhatsApp</label>
                  <input type="tel" placeholder="+234 ..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple outline-none transition" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple mb-2">Service Interested In</label>
                  <select className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple outline-none transition">
                    <option>Study Abroad</option>
                    <option>Scholarships</option>
                    <option>Visa Assistance</option>
                    <option>International Jobs</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-purple mb-2">Message</label>
                  <textarea required rows={4} placeholder="Tell us about your goals..." className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple outline-none transition" />
                </div>
                <button type="submit" className="w-full gradient-bg text-white font-semibold py-4 rounded-full shadow-lg hover:opacity-90 transition flex items-center justify-center gap-2">
                  <Send className="w-5 h-5" /> Send Message
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
