import { Link } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import SignInForm from "@/components/forms/SignInForm";
import { ROUTES } from "@/routes/routePaths";

export default function SignIn() {
  return (
    <>
      <Seo title="Sign In | M. R. Services" description="Sign in to your M. R. Services Client Portal account." path={ROUTES.signIn} />
      <Container className="max-w-md py-16">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Welcome Back</h1>
        <p className="mt-2 text-sm text-neutral-700">
          Sign in to track your society/business accounts, request typing work,
          and message us directly.
        </p>
        <div className="mt-8"><SignInForm /></div>
        <p className="mt-4 text-center text-sm text-neutral-700">
          New here? <Link to={ROUTES.signUp} className="text-primary-500 underline">Create an Account</Link>
        </p>
        <p className="mt-2 text-center text-sm">
          <Link to={ROUTES.home} className="text-neutral-400 underline">Continue browsing without signing in</Link>
        </p>
      </Container>
    </>
  );
}


