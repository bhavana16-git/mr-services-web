import { z } from "zod";

export const signUpSchema = z
  .object({
    fullName: z.string().min(2, "Please enter your full name.").max(200),
    email: z.string().email("Please enter a valid email address."),
    mobileNumber: z
      .string()
      .min(10, "Please enter a valid mobile number.")
      .max(15),
    societyOrBusinessName: z.string().max(200).optional(),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
    agreeToTerms: z.literal(true, {
      error: "You must agree to the Terms and Privacy Policy.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type SignUpInput = z.infer<typeof signUpSchema>;

