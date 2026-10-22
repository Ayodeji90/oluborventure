import { MessageCircle } from "lucide-react";

type Props = {
  message?: string;
};

export default function WhatsAppButton({ message = "Hello Olubor Ventures! I would like to make an inquiry." }: Props) {
  const href = `https://wa.me/447404662298?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass liquid-glass-frost fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2.5 h-12 w-12 sm:w-auto sm:pl-4 sm:pr-5 rounded-full bg-ink text-white text-sm font-medium transition"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
