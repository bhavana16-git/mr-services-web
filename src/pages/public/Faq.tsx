import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    q: "What documents do I need to provide for society accounting work?",
    a: "Typically, previous financial records, member lists, maintenance bill history, and bank statements. We'll guide you through the exact list based on your society's current record-keeping.",
  },
  {
    q: "Do you handle GST/TDS-related filings for societies or businesses?",
    a: "We can assist with basic compliance support and documentation; for complex tax filings, we may coordinate with your society's appointed auditor or a chartered accountant.",
  },
  {
    q: "How much do your accounting services cost?",
    a: "Pricing depends on the size of the society/business and scope of work. Reference starting prices for each package are listed on the Service Packages page inside the Client Portal (free to view once you sign up or sign in); contact us for a free, no-obligation final quote.",
  },
  {
    q: "Can I send typing work remotely?",
    a: "Yes -- documents can be shared via WhatsApp or email, and completed work is delivered digitally or in print, as needed.",
  },
  {
    q: "Do you serve areas outside Santacruz East?",
    a: "We primarily serve Santacruz and nearby areas; please contact us to confirm availability for your location.",
  },
  {
    q: "How long does monthly society accounting typically take?",
    a: "Most monthly accounting work is completed within a few working days, depending on transaction volume.",
  },
  {
    q: "Is my financial information kept confidential?",
    a: "Yes, all client data and documents are handled with strict confidentiality, both on the public website and inside the Client Portal.",
  },
  {
    q: "How do I get started?",
    a: "Simply call, WhatsApp, or fill out the contact form -- we'll discuss your requirements and next steps. No account is required just to reach out.",
  },
  {
    q: "What can I do once I create a Client Portal account?",
    a: "You can browse detailed Service Packages and reference pricing, track the status of ongoing work, access your statements and completed documents, message us directly, and submit new work requests -- all in one place.",
  },
  {
    q: "Is there any cost to sign up for the Client Portal, and can I pay online through it?",
    a: "Creating a Client Portal account is free. The portal is for information, tracking, and communication only -- it does not process payments online. Any invoicing and payment is arranged directly with M. R. Services, outside the portal.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <>
      <Seo
        title="Frequently Asked Questions | M. R. Services"
        description="Answers to common questions about M. R. Services' accounting, society management, and typing services."
        path={ROUTES.faq}
      />
      <Container className="max-w-3xl py-16">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
          Frequently Asked Questions
        </h1>
        <div className="mt-8 divide-y divide-neutral-200 rounded-lg border border-neutral-200 bg-white">
          {FAQS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <span className="font-medium text-neutral-900">{item.q}</span>
                  <ChevronDown
                    className={cn("h-4 w-4 shrink-0 text-neutral-400 transition-transform", isOpen && "rotate-180")}
                  />
                </button>
                {isOpen && (
                  <p className="px-5 pb-4 text-sm text-neutral-700">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </>
  );
}


