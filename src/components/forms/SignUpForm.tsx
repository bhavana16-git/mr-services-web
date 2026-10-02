import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/lib/validators/signUp.schema";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ROUTES } from "@/routes/routePaths";

export default function SignUpForm() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm<SignUpInput>({ resolver: zodResolver(signUpSchema) });

  async function onSubmit(values: SignUpInput) {
    setSubmitting(true);
    setServerError(null);
    const { error } = await signUp({
      email: values.email,
      password: values.password,
      fullName: values.fullName,
      mobileNumber: values.mobileNumber,
      societyOrBusinessName: values.societyOrBusinessName,
    });
    setSubmitting(false);
    if (error) { setServerError(error); return; }
    navigate(ROUTES.portalDashboard);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input id="fullName" {...register("fullName")} />
        {errors.fullName && <p className="mt-1 text-sm text-danger-500">{errors.fullName.message}</p>}
      </div>
      <div>
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p className="mt-1 text-sm text-danger-500">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="mobileNumber">Mobile Number</Label>
        <Input id="mobileNumber" {...register("mobileNumber")} />
        {errors.mobileNumber && <p className="mt-1 text-sm text-danger-500">{errors.mobileNumber.message}</p>}
      </div>
      <div>
        <Label htmlFor="societyOrBusinessName">Society/Business Name (optional)</Label>
        <Input id="societyOrBusinessName" {...register("societyOrBusinessName")} />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p className="mt-1 text-sm text-danger-500">{errors.password.message}</p>}
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="mt-1 text-sm text-danger-500">{errors.confirmPassword.message}</p>}
      </div>
      <div className="flex items-start gap-2">
        <Checkbox id="agreeToTerms" onCheckedChange={(v) => setValue("agreeToTerms", (v === true) as true)} />
        <Label htmlFor="agreeToTerms" className="text-sm font-normal">
          I agree to the <Link to={ROUTES.terms} className="text-primary-500 underline">Terms of Service</Link> and{" "}
          <Link to={ROUTES.privacy} className="text-primary-500 underline">Privacy Policy</Link>
        </Label>
      </div>
      {errors.agreeToTerms && <p className="text-sm text-danger-500">{errors.agreeToTerms.message}</p>}

      {serverError && <p className="text-sm text-danger-500">{serverError}</p>}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}

