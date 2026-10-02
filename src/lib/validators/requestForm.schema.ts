import { z } from "zod";

export const requestFormSchema = z.object({
  packageId: z.string().uuid().nullable(),
  serviceCategory: z.enum([
    "society_accounting",
    "business_accounting",   
    "typing_services",
    "other"                 
  ]),
  description: z.string().min(10, "Please describe what you need.").max(5000),
  preferredStartDate: z.string().nullable(),
  preferredContactMethod: z.enum(["call", "whatsapp", "email"]),
});

export type RequestFormInput = z.infer<typeof requestFormSchema>;


