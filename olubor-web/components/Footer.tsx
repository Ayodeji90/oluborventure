import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const socials = [
  {
    label: "Facebook",
    path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
  },
  {
    label: "Instagram",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a.75.75 0 110 1.5.75.75 0 010-1.5z",
  },
  {
    label: "X (Twitter)",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
];

export default function Footer() {
  return (
    <footer className="bg-purple text-white py-14 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/olubor-logo.svg" alt="" className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold leading-tight">OLUBOR VENTURES</h3>
                <p className="text-xs opacity-80">Educational Consult</p>
              </div>
            </div>
            <p className="opacity-70 text-sm">
              Your trusted partner for international education and career opportunities.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="opacity-70 hover:opacity-100 transition">About Us</Link></li>
              <li><Link href="/services" className="opacity-70 hover:opacity-100 transition">Services</Link></li>
              <li><Link href="/destinations" className="opacity-70 hover:opacity-100 transition">Destinations</Link></li>
              <li><Link href="/success-stories" className="opacity-70 hover:opacity-100 transition">Success Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/services/study-abroad" className="opacity-70 hover:opacity-100 transition">Study Abroad</Link></li>
              <li><Link href="/services/scholarships" className="opacity-70 hover:opacity-100 transition">Scholarships</Link></li>
              <li><Link href="/services/visa-assistance" className="opacity-70 hover:opacity-100 transition">Visa Assistance</Link></li>
              <li><Link href="/services/international-jobs" className="opacity-70 hover:opacity-100 transition">International Jobs</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 opacity-70" /> Lagos, Nigeria</li>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 opacity-70" /> info@oluborventures.com</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 opacity-70" /> +234 XXX XXX XXXX</li>
            </ul>
            <div className="flex space-x-3 mt-5">
              {socials.map((s) => (
                <a key={s.label} href="#" aria-label={s.label} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d={s.path} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm">
          <p className="opacity-70">© 2026 Olubor Ventures and Educational Consult. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="opacity-70 hover:opacity-100 transition">Terms</Link>
            <Link href="/privacy" className="opacity-70 hover:opacity-100 transition">Privacy</Link>
            <Link href="/faq" className="opacity-70 hover:opacity-100 transition">FAQ</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
