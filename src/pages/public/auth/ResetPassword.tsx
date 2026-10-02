import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Seo from "@/components/common/Seo";
import Container from "@/components/common/Container";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    navigate(ROUTES.portalDashboard);
  }

  return (
    <>
      <Seo title="Set a New Password | M. R. Services" description="Set a new password for your M. R. Services Client Portal account." path={ROUTES.resetPassword} />
      <Container className="max-w-md py-16">
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Set a New Password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="text-sm text-danger-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Saving..." : "Save New Password"}
          </Button>
        </form>
      </Container>
    </>
  );
}

