import { Link } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import SignUpForm from "@/components/forms/SignUpForm";
import { ROUTES } from "@/routes/routePaths";

export default function SignUp() {
  return (
    <>
      <Seo title="Create Your Client Account | M. R. Services" description="Sign up to view detailed Service Packages, track your requests, and message M. R. Services directly." path={ROUTES.signUp} />
      <Container className="max-w-md py-16">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Create Your Client Account</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Sign up to view detailed Service Packages, track your society/business
          accounts, request typing work, and communicate with us directly -- no
          account needed to browse our services or contact us.
        </p>
        <div className="mt-8"><SignUpForm /></div>
        <p className="mt-4 text-center text-sm text-neutral-700">
          Already have an account? <Link to={ROUTES.signIn} className="text-primary-500 underline">Sign In</Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to={ROUTES.home} className="text-neutral-400 underline">Continue browsing without an account</Link>
        </p>
      </Container>
    </>
  );
}

