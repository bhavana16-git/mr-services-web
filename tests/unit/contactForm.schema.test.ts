import { describe, it, expect } from "vitest";
import { contactFormSchema } from "@/lib/validators/contactForm.schema";

describe("contactFormSchema", () => {
  it("accepts a fully valid submission", () => {
    const result = contactFormSchema.safeParse({
      name: "Priya Shah",
      phone: "9876543210",
      email: "priya@example.com",
      serviceInterestedIn: "society_accounting",
      message: "Need help with monthly accounts.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Priya Shah",
      phone: "9876543210",
      email: "not-an-email",
      serviceInterestedIn: "society_accounting",
      message: "Need help with monthly accounts.",
    });
    expect(result.success).toBe(false);
  });
});




