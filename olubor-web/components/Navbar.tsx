"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/destinations", label: "Destinations" },
  { href: "/programs", label: "Programs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed w-full bg-white/95 backdrop-blur-sm shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/olubor-logo.svg" alt="Olubor Ventures logo" className="w-9 h-9" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-purple leading-tight">OLUBOR VENTURES</h1>
              <p className="text-xs text-purple opacity-80">Educational Consult</p>
            </div>
          </Link>

          <div className="hidden md:flex space-x-7">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`font-medium transition hover:text-orange-dark ${
                  pathname === l.href ? "text-orange-dark" : "text-purple"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-6 py-2 bg-purple text-white rounded-full font-medium hover:bg-purple-light transition"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden text-purple"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-purple font-medium hover:text-orange-dark transition"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block text-center w-full px-6 py-2 bg-purple text-white rounded-full font-medium"
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
}
