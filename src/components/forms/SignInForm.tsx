import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type SignInInput } from "@/lib/validators/signIn.schema";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routePaths";

export default function SignInForm() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({ resolver: zodResolver(signInSchema) });

  async function onSubmit(values: SignInInput) {
    setSubmitting(true);
    setServerError(null);
    const { error } = await signIn(values.email, values.password);
    setSubmitting(false);
    if (error) { setServerError(error); return; }
    navigate(searchParams.get("redirect") ?? ROUTES.portalDashboard);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-danger-500">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link to={ROUTES.forgotPassword} className="text-xs text-primary-500 underline">Forgot password?</Link>
        </div>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="mt-1 text-sm text-danger-500">{errors.password.message}</p>}
      </div>
      {serverError && <p className="text-sm text-danger-500">{serverError}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Signing In..." : "Sign In"}
      </Button>
    </form>
  );
}

