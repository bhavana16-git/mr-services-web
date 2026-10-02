import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import ContactForm from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { ROUTES } from "@/routes/routePaths";
import { BUSINESS, callLink, whatsappLink } from "@/lib/constants";

export default function Contact() {
  const mapQuery = encodeURIComponent(BUSINESS.address);
  const directionsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <>
      <Seo
        title="Contact Us | M. R. Services"
        description="Get in touch with M. R. Services in Santacruz East, Mumbai -- by phone, WhatsApp, email, or our contact form."
        path={ROUTES.contact}
      />
      <Container className="grid gap-12 py-16 lg:grid-cols-2">
        <div>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">Get in Touch</h1>

          <dl className="mt-6 space-y-3 text-sm text-neutral-700">
            <div><dt className="font-medium text-neutral-900">Contact Person</dt><dd>{BUSINESS.proprietor}</dd></div>
            <div><dt className="font-medium text-neutral-900">Phone</dt><dd>{BUSINESS.phones.join(" / ")}</dd></div>
            <div><dt className="font-medium text-neutral-900">Email</dt><dd>{BUSINESS.email}</dd></div>
            <div><dt className="font-medium text-neutral-900">Address</dt><dd>{BUSINESS.address}</dd></div>
          </dl>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild><a href={callLink(BUSINESS.phones[0])}>Call Now</a></Button>
            <Button asChild variant="secondary">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
            <MapPin className="h-5 w-5 shrink-0 text-primary-700" />
            <div className="flex-1">
              <p className="text-sm text-neutral-700">{BUSINESS.address}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <a href={directionsLink} target="_blank" rel="noopener noreferrer">
                Get Directions
              </a>
            </Button>
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <ContactForm />
        </div>
      </Container>
    </>
  );
}

