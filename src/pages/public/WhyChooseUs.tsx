import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";

const REASONS = [
  { title: "Personalized Service", text: "Direct, one-on-one attention, never handed off to a call center." },
  { title: "Accuracy You Can Rely On", text: "Careful, error-free work every time." },
  { title: "Affordable, Transparent Pricing", text: "No hidden charges." },
  { title: "Local Expertise", text: "Deep familiarity with Mumbai co-operative society rules and processes." },
  { title: "On-Time Delivery", text: "Deadlines taken seriously, especially around AGMs and audits." },
];

export default function WhyChooseUs() {
  const { data: testimonials } = useQuery({
    queryKey: ["why-choose-us-testimonials"],
    queryFn: async () => {
      const { data } = await supabase
        .from("testimonials")
        .select("author_name, author_role, quote")
        .eq("is_active", true)
        .order("sort_order");
      return data ?? [];
    },
  });

  return (
    <>
      <Seo
        title="Why Choose Us | M. R. Services"
        description="Personalized, accurate, and affordable accounting and typing services with deep local Mumbai society expertise."
        path={ROUTES.whyChooseUs}
      />
      <Container className="max-w-3xl py-16">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">Why Choose Us</h1>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {REASONS.map((r) => (
            <div key={r.title} className="rounded-lg border border-neutral-200 bg-white p-5">
              <h3 className="font-heading text-lg font-semibold text-neutral-900">{r.title}</h3>
              <p className="mt-1 text-sm text-neutral-700">{r.text}</p>
            </div>
          ))}
        </div>

        <h2 className="mt-14 font-heading text-2xl font-semibold text-neutral-900">Testimonials</h2>
        <div className="mt-6 space-y-6">
          {testimonials?.map((t, i) => (
            <blockquote key={i} className="border-l-4 border-accent-500 pl-4">
              <p className="italic text-neutral-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-2 text-sm font-medium text-neutral-900">
                &mdash; {t.author_name}{t.author_role ? `, ${t.author_role}` : ""}
              </footer>
            </blockquote>
          ))}
        </div>
      </Container>
    </>
  );
}


