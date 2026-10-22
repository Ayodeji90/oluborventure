import Image from "next/image";

type EmblemProps = {
  className?: string;
  variant?: "default" | "white";
};

/**
 * Olubor emblem — sun rays, globe and open book.
 * Sourced from /logo.webp or /logo-white.webp.
 */
export default function Emblem({ className = "", variant = "default" }: EmblemProps) {
  const src = variant === "white" ? "/logo-white.webp" : "/logo.webp";
  return (
    <Image
      src={src}
      alt="Olubor Ventures emblem"
      width={120}
      height={80}
      className={`object-contain ${className}`}
      priority
    />
  );
}
