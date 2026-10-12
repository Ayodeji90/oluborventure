import { MessageCircle } from "lucide-react";

type Props = {
  message?: string;
};

export default function WhatsAppButton({ message = "Hello Olubor Ventures! I would like to make an inquiry." }: Props) {
  const href = `https://wa.me/2340000000000?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform duration-300"
      aria-label="Chat with us on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  );
}
