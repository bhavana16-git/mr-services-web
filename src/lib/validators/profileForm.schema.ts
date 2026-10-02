import { z } from "zod";

export const profileFormSchema = z.object({
  fullName: z.string().min(2).max(200),
  mobileNumber: z.string().min(10).max(15),
  societyOrBusinessName: z.string().max(200).optional(),
  notificationPreference: z.enum(["email", "whatsapp", "both"]),
});

export type ProfileFormInput = z.infer<typeof profileFormSchema>;



