import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "dark";
  className?: string;
};

export default function CTAButton({ href, children, variant = "primary", className = "" }: Props) {
  const styles = {
    primary: "bg-purple-mid text-white shadow-sm hover:bg-purple hover:shadow-md",
    secondary: "bg-white text-ink border border-gray-300 hover:border-purple-mid hover:text-purple-mid",
    dark: "bg-ink text-white hover:bg-purple",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center min-h-[48px] px-7 rounded-full font-semibold text-[15px] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
