import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";

export default function About() {
  return (
    <>
      <Seo
        title="About Us | M. R. Services"
        description="M. R. Services is a Mumbai-based accounting and administrative services provider, founded and led by Manali M. Rane."
        path={ROUTES.about}
      />
      <Container className="max-w-3xl py-16">
        <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-4xl">
          About M. R. Services
        </h1>

        <p className="mt-6 text-neutral-700">
          M. R. Services is a Mumbai-based accounting and administrative services
          provider, founded and led by Manali M. Rane. We specialize in helping
          co-operative housing societies, small businesses, and individuals manage
          their financial records accurately, stay compliant, and stay organized.
        </p>
        <p className="mt-4 text-neutral-700">
          Based in Santacruz (East), we've built our practice on trust, attention to
          detail, and genuine care for every client's needs -- whether it's a housing
          society managing hundreds of members or an individual needing a single
          document typed correctly.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-semibold text-neutral-900">Our Mission</h2>
        <p className="mt-3 text-neutral-700">
          To provide accurate, timely, and affordable accounting and administrative
          support to co-operative societies, businesses, and individuals across Mumbai.
        </p>

        <h2 className="mt-10 font-heading text-2xl font-semibold text-neutral-900">Our Approach</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-neutral-700">
          <li><strong>Personalized service</strong> -- every client's work is handled directly, not outsourced</li>
          <li><strong>Confidentiality</strong> -- your financial and personal information stays private</li>
          <li><strong>Reliability</strong> -- deadlines are respected, and work is double-checked for accuracy</li>
        </ul>

        <h2 className="mt-10 font-heading text-2xl font-semibold text-neutral-900">
          Meet the Proprietor -- Manali M. Rane
        </h2>
        <p className="mt-3 text-neutral-700">
          {/* TODO before launch: replace with Manali's confirmed qualifications, years
              of experience, and number of societies/clients served. */}
          Manali has been supporting Mumbai's co-operative housing societies and small
          businesses with reliable accounting and documentation services.
        </p>
      </Container>
    </>
  );
}



