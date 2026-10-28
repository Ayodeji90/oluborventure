"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Mail, Phone, MapPin } from "lucide-react";
import Emblem from "./Emblem";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Our Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/contact", label: "Contact Us" },
];



export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      {/* Utility bar */}
      <div className="bg-purple text-white/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-9 text-[12px]">
            <div className="flex items-center gap-x-5 gap-y-1 flex-wrap">
              <a href="mailto:info@oluborconsults.com" className="flex items-center gap-1.5 hover:text-white transition">
                <Mail className="w-3.5 h-3.5 text-amber shrink-0" /> info@oluborconsults.com
              </a>
              <a href="tel:+447404662298" className="hidden sm:flex items-center gap-1.5 hover:text-white transition">
                <Phone className="w-3.5 h-3.5 text-amber shrink-0" /> +44 7404 662298
              </a>
              <span className="hidden lg:flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber shrink-0" /> Lagos, Nigeria
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-white/70 bg-white/95 shadow-[0_5px_24px_rgba(12,18,34,0.08)] backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-3 py-2" aria-label="Olubor Ventures and Educational Consult — home">
              <Emblem className="h-10 w-auto shrink-0" />
              <span className="leading-tight whitespace-nowrap">
                <span className="block font-statement text-[17px] text-purple-mid uppercase">Olubor Ventures</span>
                <span className="block text-[8.5px] font-bold text-ink-3 tracking-[0.18em] uppercase mt-[2px]">And Educational Consult</span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  className={`relative px-3.5 py-2.5 text-[14px] font-medium transition-colors after:absolute after:bottom-0 after:left-3.5 after:right-3.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-amber after:transition-transform ${
                    pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href))
                      ? "text-purple-mid after:scale-x-100"
                      : "text-ink-2 hover:text-purple-mid hover:after:scale-x-100"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <Link
              href="/apply"
              className="liquid-glass hidden lg:inline-flex items-center px-5 h-10 bg-purple-mid text-white text-[13px] font-semibold uppercase tracking-wide rounded-full hover:bg-purple transition"
            >
              Get Started
            </Link>

            <button
              className="lg:hidden text-ink p-2.5 -mr-2.5"
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden border-t border-gray-100 bg-white/98 px-4 pb-5 pt-2 shadow-xl backdrop-blur-xl max-h-[70vh] overflow-y-auto">
            {links.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`block border-b border-gray-100 py-3.5 text-[15px] font-medium last:border-0 transition-colors ${pathname === l.href || (l.href !== "/" && pathname.startsWith(l.href)) ? "text-purple-mid" : "text-ink-2 hover:text-purple-mid"}`}
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/apply"
              onClick={() => setOpen(false)}
              className="liquid-glass mt-3 flex items-center justify-center h-12 bg-purple-mid text-white font-semibold rounded-full uppercase text-sm tracking-wide"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
