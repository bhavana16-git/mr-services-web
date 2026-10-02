import { MessageCircle } from "lucide-react";
import { whatsappLink } from "@/lib/constants";

export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with M. R. Services on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center
                 rounded-full bg-teal-500 text-white shadow-md hover:bg-teal-500/90
                 transition-colors"
    >
      <MessageCircle className="h-6 w-6" strokeWidth={1.75} />
    </a>
  );
}
