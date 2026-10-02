import { Link } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

const SECTIONS = [
  {
    id: "society",
    title: "a) Co-operative Society Management cum Accounting Work",
    intro:
      "Running a housing society's finances involves more than collecting maintenance -- it means accurate books, transparent reporting, and full compliance. We handle:",
    items: [
      "Maintenance bill preparation and collection tracking",
      "Society ledger and cash book maintenance",
      "Bank reconciliation",
      "Member account records (dues, arrears, advance payments)",
      "Preparation of income & expenditure statements",
      "AGM documentation and minutes support",
      "Assistance with statutory audits and compliance paperwork",
    ],
  },
  {
    id: "business",
    title: "b) Small Scale Companies & Individual Accounting Work",
    intro:
      "Whether you run a small business or want your personal finances organized, we provide:",
    items: [
      "Daily/monthly bookkeeping",
      "Ledger and journal maintenance",
      "Invoice and billing support",
      "Preparation of financial statements",
      "Personal income and expense tracking",
    ],
  },
  {
    id: "typing",
    title: "c) English Typing Work",
    intro: "Accurate, professionally formatted typing for all documentation needs:",
    items: [
      "Letters, applications, and official correspondence",
      "Legal and government form typing",
      "Resume/CV typing and formatting",
      "Society notices, circulars, and reports",
      "General document typing and formatting",
    ],
  },
];

export default function Services() {
  return (
    <>
      <Seo
        title="Accounting, Society Management & Typing Services in Mumbai | M. R. Services"
        description="Co-operative society accounting, business and individual bookkeeping, and English typing services in Santacruz East, Mumbai."
        path={ROUTES.services}
      />
      <Container className="max-w-3xl py-16">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
          Our Services
        </h1>

        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="mt-12 scroll-mt-24">
            <h2 className="font-heading text-2xl font-semibold text-neutral-900">{section.title}</h2>
            <p className="mt-3 text-neutral-700">{section.intro}</p>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        ))}

        <div className="mt-14 rounded-lg bg-primary-100 p-6 text-center">
          <p className="text-neutral-900">
            Need one of these services? Contact us for a quick quote, or sign in to view
            detailed Service Packages and pricing in your Client Portal.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Button asChild><Link to={ROUTES.contact}>Contact Us</Link></Button>
            <Button asChild variant="outline"><Link to={ROUTES.signIn}>Sign In</Link></Button>
          </div>
        </div>
      </Container>
    </>
  );
}



