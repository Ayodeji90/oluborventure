import type { Metadata } from "next";
import { Suspense } from "react";
import { Poppins, Playfair_Display, Figtree } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Serif display font — hero statements only
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

// Humanist-geometric sans — hero lede / supporting copy
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Olubor Ventures & Educational Consult",
    template: "%s | Olubor Ventures",
  },
  description:
    "Study abroad, scholarships, visa assistance, and international job placements — guided by counselors who have done it 500+ times.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} ${playfair.variable} ${figtree.variable} antialiased`}>
      <body className="min-h-screen flex flex-col">
        {/*
          Navbar reads usePathname(), which suspends while prerendering any route
          with a dynamic param that isn't known at build time (e.g. a portal
          application id). The boundary lets those routes prerender; the fallback
          reserves the same height so nothing shifts.
        */}
        <Suspense fallback={<div className="h-[100px]" aria-hidden />}>
          <Navbar />
        </Suspense>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
