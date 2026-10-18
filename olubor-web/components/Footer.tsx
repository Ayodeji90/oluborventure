"use client";

import { useState } from "react";
import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import Emblem from "./Emblem";

const socials = [
  { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a.75.75 0 110 1.5.75.75 0 010-1.5z" },
  { label: "X (Twitter)", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { label: "LinkedIn", path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
];

const serviceLinks = [
  { href: "/services/study-abroad", label: "Study Abroad" },
  { href: "/services/scholarships", label: "Scholarships" },
  { href: "/services/visa-assistance", label: "Visa Guidance" },
  { href: "/services/international-jobs", label: "International Jobs" },
  { href: "/programs", label: "Programs" },
  { href: "/destinations", label: "Destinations" },
];

const companyLinks = [
  { href: "/about", label: "About Olubor" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact Us" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="relative bg-ink text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/images/student.jpg)" }}
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/90" aria-hidden />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid md:grid-cols-[1.3fr_1.3fr_1fr] gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Emblem variant="white" className="h-10 w-auto shrink-0" />
              <span className="leading-tight">
                <span className="block font-statement text-[20px] uppercase text-white">Olubor Ventures</span>
                <span className="block text-[9px] font-bold text-white/60 tracking-[0.18em] uppercase mt-1">And Educational Consult</span>
              </span>
            </div>
            <p className="text-white/70 text-[15px] max-w-sm leading-relaxed mb-6">
              Placing students and professionals into global universities and
              careers since 2016. Formerly Future Builders Educational Institute.
            </p>
            <ul className="space-y-2.5 text-[15px]">
              <li><span className="font-bold">Tel:</span> <a href="tel:+2340000000000" className="text-white/80 hover:text-white transition">+234 000 000 0000</a></li>
              <li><span className="font-bold">Email:</span> <a href="mailto:info@oluborventures.com" className="text-white/80 hover:text-white transition">info@oluborventures.com</a></li>
              <li><span className="font-bold">Location:</span> <span className="text-white/80">Lagos, Nigeria</span></li>
            </ul>
            <div className="flex gap-3 mt-6">
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white/80 hover:text-white hover:border-white transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer" className="grid sm:grid-cols-2 gap-8">
            <div>
              <h4 className="text-[14px] font-bold tracking-wide uppercase mb-5">Our Services</h4>
              <ul className="space-y-3 text-[15px]">
                {serviceLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/70 hover:text-white transition inline-flex items-center gap-2">
                      <span className="text-amber text-xs" aria-hidden>›</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[14px] font-bold tracking-wide uppercase mb-5">Company</h4>
              <ul className="space-y-3 text-[15px]">
                {companyLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-white/70 hover:text-white transition inline-flex items-center gap-2">
                      <span className="text-amber text-xs" aria-hidden>›</span> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Mailing list */}
          <div>
            <h4 className="text-[14px] font-bold tracking-wide uppercase mb-5">Join Our Mailing List</h4>
            {subscribed ? (
              <p className="text-amber text-[15px]">You&apos;re on the list. Talk soon.</p>
            ) : (
              <form
                onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }}
                className="space-y-3"
              >
                <p className="text-white/60 text-sm leading-relaxed">
                  Study advice, deadlines, and scholarship openings — once a month.
                </p>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Type Email"
                  aria-label="Email address"
                  className="w-full h-11 px-4 bg-white text-ink text-[15px] rounded-sm focus:outline-none focus:ring-2 focus:ring-amber"
                />
                <button
                  type="submit"
                  className="px-6 h-10 bg-white/20 hover:bg-amber transition text-white text-sm font-semibold uppercase tracking-wide rounded-sm"
                >
                  Submit
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/15 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <p>© 2026 Olubor Ventures and Educational Consult. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
