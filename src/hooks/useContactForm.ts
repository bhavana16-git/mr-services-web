import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import type { ContactFormInput } from "@/lib/validators/contactForm.schema";

export function useContactForm() {
  return useMutation({
    mutationFn: async (input: ContactFormInput & { turnstileToken: string }) => {
      const { data, error } = await supabase.functions.invoke("submit-contact-form", {
        body: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          service_interested_in: input.serviceInterestedIn,
          message: input.message,
          turnstileToken: input.turnstileToken,
        },
      });
      if (error) throw new Error("Something went wrong -- please try again.");
      if (data?.error) throw new Error(data.error.message);
      return data;
    },
  });
}

