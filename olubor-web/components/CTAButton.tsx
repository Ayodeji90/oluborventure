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
    primary: "bg-purple text-white hover:bg-purple-mid",
    secondary: "bg-white text-ink border border-gray-300 hover:border-purple hover:text-purple",
    dark: "bg-ink text-white hover:bg-purple",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center min-h-[48px] px-7 rounded-lg font-semibold text-[15px] transition ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}
