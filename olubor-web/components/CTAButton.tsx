import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "gradient";
  className?: string;
};

export default function CTAButton({ href, children, variant = "primary", className = "" }: Props) {
  const styles = {
    primary: "bg-purple text-white hover:bg-purple-light",
    secondary: "bg-white text-purple border-2 border-purple hover:bg-cream",
    gradient: "gradient-bg text-white hover:opacity-90",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-8 py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-300 hover:-translate-y-0.5 ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
