import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";
import { BUSINESS, callLink, whatsappLink, SITE_URL } from "@/lib/constants";

const SERVICES_OVERVIEW = [
  {
    title: "Co-operative Society Accounting",
    text: "Maintenance billing, ledgers, AGM support, and compliance records for housing societies.",
  },
  {
    title: "Business & Individual Accounting",
    text: "Bookkeeping, ledgers, and financial statements for small businesses and individuals.",
  },
  {
    title: "English Typing Services",
    text: "Letters, forms, resumes, and society documentation, typed accurately and delivered on time.",
  },
];

const TRUST_STRIP = [
  "Personalized Attention",
  "Accurate & Timely Work",
  "Affordable Rates",
  "Strong Local Experience in Mumbai Societies",
];

export default function Home() {
  const { data: testimonial } = useQuery({
    queryKey: ["home-featured-testimonial"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("author_name, author_role, quote")
        .eq("is_active", true)
        .order("sort_order")
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  return (
    <>
      <Seo
        title="M. R. Services -- Co-operative Society Accounting & Typing Services, Santacruz, Mumbai"
        description="Professional accounting, society management, and English typing services in Santacruz East, Mumbai, led by Manali M. Rane."
        path={ROUTES.home}
      />

      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AccountingService",
            name: "M. R. Services",
            image: `${SITE_URL}/logo/mr-logo.png`,
            telephone: "+91-8928131858",
            email: "ranemanali2411@gmail.com",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Jay Bharat Society, Vikas Mandal, Patel Nagar",
              addressLocality: "Santacruz East, Mumbai",
              postalCode: "400055",
              addressCountry: "IN",
            },
            areaServed: "Santacruz East, Mumbai",
          })}
        </script>
      </Helmet>

      {/* Hero */}
      <section className="bg-primary-900 text-white">
        <Container className="py-20 text-center md:py-28">
          <h1 className="font-heading text-4xl font-bold md:text-5xl">M. R. Services</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/85 md:text-xl">
            Reliable Accounting &amp; Co-operative Society Management You Can Trust
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-white/70">
            Professional accounting, society management, and English typing services in
            Santacruz East, Mumbai -- led by Manali M. Rane.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg">
              <a href={callLink(BUSINESS.phones[0])}>Call Now: {BUSINESS.phones[0]}</a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white border-white/40">
              <Link to={ROUTES.contact}>Get a Free Consultation</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Intro */}
      <section className="py-14">
        <Container className="max-w-3xl text-center">
          <p className="text-neutral-700">
            M. R. Services helps co-operative housing societies, small businesses, and
            individuals in Mumbai keep their accounts accurate, their documentation
            professional, and their compliance stress-free. With a personal,
            detail-focused approach, we handle the numbers and paperwork so you don't
            have to.
          </p>
        </Container>
      </section>

      {/* Services overview */}
      <section className="bg-neutral-100 py-16">
        <Container>
          <h2 className="text-center font-heading text-3xl font-bold text-neutral-900">
            Our Services
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {SERVICES_OVERVIEW.map((s) => (
              <div key={s.title} className="rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="font-heading text-xl font-semibold text-neutral-900">{s.title}</h3>
                <p className="mt-2 text-sm text-neutral-700">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild variant="secondary">
              <Link to={ROUTES.services}>View All Services</Link>
            </Button>
          </div>
        </Container>
      </section>

      {/* Trust strip */}
      <section className="py-10">
        <Container className="flex flex-wrap justify-center gap-x-10 gap-y-3 text-sm font-medium text-neutral-700">
          {TRUST_STRIP.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </Container>
      </section>

      {/* Featured testimonial */}
      {testimonial && (
        <section className="bg-primary-100 py-14">
          <Container className="max-w-2xl text-center">
            <p className="font-heading text-xl italic text-primary-900">&ldquo;{testimonial.quote}&rdquo;</p>
            <p className="mt-4 text-sm font-medium text-neutral-700">
              &mdash; {testimonial.author_name}
              {testimonial.author_role ? `, ${testimonial.author_role}` : ""}
            </p>
          </Container>
        </section>
      )}

      {/* Closing CTA */}
      <section className="bg-accent-500 py-16 text-center">
        <Container>
          <h2 className="font-heading text-3xl font-bold text-primary-900">
            Need Help With Your Society's Accounts or Documentation?
          </h2>
          <p className="mt-2 text-primary-900/80">
            Get in touch today for a free, no-obligation discussion.
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary-900 hover:bg-primary-900/90">
            <Link to={ROUTES.contact}>Contact Us Now</Link>
          </Button>
        </Container>
      </section>
    </>
  );
}

