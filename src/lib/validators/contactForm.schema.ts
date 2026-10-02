import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name.").max(200),
  phone: z.string().min(8, "Please enter a valid phone number.").max(20),
  email: z.string().email("Please enter a valid email address."),
  serviceInterestedIn: z.enum([
    "society_accounting",
    "business_accounting",
    "typing_services",
    "other",
  ]),
  message: z.string().min(5, "Please enter a short message.").max(5000),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;


