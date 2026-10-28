import Link from "next/link";
import Emblem from "./Emblem";

const serviceLinks = [
  { href: "/services/study-abroad", label: "Study Abroad" },
  { href: "/services/scholarships", label: "Scholarships" },
  { href: "/services/visa-assistance", label: "Visa Guidance" },
  { href: "/services/international-jobs", label: "International Jobs" },
  { href: "/services/canada-processing", label: "Canada 🇨🇦 Processing" },
  { href: "/services/french-tutoring", label: "French Tutoring" },
  { href: "/services/flight-booking", label: "Flight Booking" },
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
  return (
    <footer className="relative bg-ink text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url(/images/student.webp)" }}
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
              <li><span className="font-bold">Tel:</span> <a href="tel:+447404662298" className="text-white/80 hover:text-white transition">+44 7404 662298</a></li>
              <li><span className="font-bold">Email:</span> <a href="mailto:info@oluborconsults.com" className="text-white/80 hover:text-white transition">info@oluborconsults.com</a></li>
              <li><span className="font-bold">Location:</span> <span className="text-white/80">Lagos, Nigeria</span></li>
            </ul>

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

          {/* Contact call to action */}
          <div>
            <h4 className="text-[14px] font-bold tracking-wide uppercase mb-5">Need guidance?</h4>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Ask us about applications, scholarship deadlines, and your next steps.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center min-h-11 px-5 border border-white/40 rounded-md text-sm font-semibold text-white hover:bg-white hover:text-ink transition"
            >
              Talk to a counselor
            </Link>
          </div>
        </div>

        <div className="border-t border-white/15 mt-14 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-white/50">
          <p>© 2016–2026 Olubor Ventures and Educational Consult. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
