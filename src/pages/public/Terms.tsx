import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";

export default function Terms() {
  return (
    <>
      <Seo title="Terms of Service | M. R. Services" description="Terms of Service for the M. R. Services website and Client Portal." path={ROUTES.terms} />
      <Container className="max-w-3xl py-16 prose prose-neutral">
        <h1>Terms of Service</h1>
        <p className="text-sm text-neutral-400">Last updated: [date to be finalized before launch]</p>

        <h2>1. Acceptable Use of the Client Portal</h2>
        <p>[FINAL COPY REQUIRED -- describe permitted use of the
           Client Portal: viewing packages, tracking requests, messaging, viewing
           documents.]</p>

        <h2>2. No Online Payments</h2>
        <p>The Client Portal is for information, tracking, and communication only.
           It does not process, collect, or store any online payments. All
           invoicing and payment for services is arranged directly with
           M. R. Services, outside the portal.</p>

        <h2>3. Confidentiality</h2>
        <p>[FINAL COPY REQUIRED -- confidentiality commitments regarding client
           financial data and documents.]</p>

        <h2>4. Account Termination</h2>
        <p>[FINAL COPY REQUIRED -- conditions under which a Client Portal account
           may be suspended or closed.]</p>
      </Container>
    </>
  );
}


