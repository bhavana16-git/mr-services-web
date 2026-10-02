import { useState } from "react";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabaseClient";
import { SITE_URL } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}${ROUTES.resetPassword}`,
    });
    setSubmitting(false);
    setSent(true); // Always show success, whether or not the email exists (Security.md S2).
  }

  return (
    <>
      <Seo title="Reset Your Password | M. R. Services" description="Request a password reset link for your M. R. Services Client Portal account." path={ROUTES.forgotPassword} />
      <Container className="max-w-md py-16">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Reset Your Password</h1>
        {sent ? (
          <p className="mt-4 text-neutral-700">
            If an account exists for that email, a password reset link has been sent.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        )}
      </Container>
    </>
  );
}


