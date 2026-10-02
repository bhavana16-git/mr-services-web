export const SITE_URL = import.meta.env.VITE_SITE_URL as string;
export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER as string;
export const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY as string;

export const BUSINESS = {
  name: "M. R. Services",
  proprietor: "Manali M. Rane",
  phones: ["8928131858", "8070080089"],
  email: "ranemanali2411@gmail.com",
  address: "Jay Bharat Society, Vikas Mandal, Patel Nagar, Santacruz (East), Mumbai - 400 055",
};

export function whatsappLink(prefilledText = "") {
  const text = encodeURIComponent(prefilledText || "Hello M. R. Services,");
  return `https://wa.me/91${WHATSAPP_NUMBER.replace(/^91/, "")}?text=${text}`;
}

export function callLink(phone: string) {
  return `tel:+91${phone}`;
}

