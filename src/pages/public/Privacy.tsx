import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { ROUTES } from "@/routes/routePaths";

export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | M. R. Services" description="Privacy Policy for the M. R. Services website and Client Portal." path={ROUTES.privacy} />
      <Container className="max-w-3xl py-16 prose prose-neutral">
        <h1>Privacy Policy</h1>
        <p className="text-sm text-neutral-400">Last updated: [date to be finalized before launch]</p>

        <h2>1. Information We Collect</h2>
        <p>[FINAL COPY REQUIRED -- contact form submissions (name, phone,
           email, message), Client Portal account details, and documents you
           upload to the portal.]</p>

        <h2>2. Why We Collect It</h2>
        <p>[FINAL COPY REQUIRED -- responding to enquiries, providing the
           accounting/typing services, and operating the Client Portal.]</p>

        <h2>3. How Long We Keep It</h2>
        <p>[FINAL COPY REQUIRED -- retention periods.]</p>

        <h2>4. Third Parties Involved</h2>
        <p>[FINAL COPY REQUIRED -- Supabase (data processor/hosting), the
           email delivery provider, and the analytics provider, if any.]</p>

        <h2>5. Your Rights</h2>
        <p>[FINAL COPY REQUIRED -- how a client can request access to, or
           deletion of, their data.]</p>
      </Container>
    </>
  );
}

