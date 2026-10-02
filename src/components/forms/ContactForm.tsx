import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormInput } from "@/lib/validators/contactForm.schema";
import { useContactForm } from "@/hooks/useContactForm";
import TurnstileWidget from "./TurnstileWidget";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SERVICE_OPTIONS = [
  { value: "society_accounting", label: "Society Accounting" },
  { value: "business_accounting", label: "Business Accounting" },
  { value: "typing_services", label: "Typing Work" },
  { value: "other", label: "Other" },
];

export default function ContactForm() {
  const [turnstileToken, setTurnstileToken] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const mutation = useContactForm();

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm<ContactFormInput>({ resolver: zodResolver(contactFormSchema) });

  async function onSubmit(values: ContactFormInput) {
    if (!turnstileToken) return;
    await mutation.mutateAsync({ ...values, turnstileToken });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg bg-teal-100 p-6 text-teal-500">
        <p className="font-medium">Thank you! Your message has been sent.</p>
        <p className="mt-1 text-sm">We'll get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register("name")} aria-describedby="name-error" />
        {errors.name && <p id="name-error" className="mt-1 text-sm text-danger-500">{errors.name.message}</p>}
      </div>

      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input id="phone" {...register("phone")} aria-describedby="phone-error" />
        {errors.phone && <p id="phone-error" className="mt-1 text-sm text-danger-500">{errors.phone.message}</p>}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} aria-describedby="email-error" />
        {errors.email && <p id="email-error" className="mt-1 text-sm text-danger-500">{errors.email.message}</p>}
      </div>

      <div>
        <Label htmlFor="service">Service Interested In</Label>
        <Select onValueChange={(v) => setValue("serviceInterestedIn", v as ContactFormInput["serviceInterestedIn"])}>
          <SelectTrigger id="service"><SelectValue placeholder="Choose a service" /></SelectTrigger>
          <SelectContent>
            {SERVICE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.serviceInterestedIn && (
          <p className="mt-1 text-sm text-danger-500">Please choose a service.</p>
        )}
      </div>

      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" rows={4} {...register("message")} aria-describedby="message-error" />
        {errors.message && <p id="message-error" className="mt-1 text-sm text-danger-500">{errors.message.message}</p>}
      </div>

      <TurnstileWidget onToken={setTurnstileToken} />

      {mutation.isError && (
        <p className="text-sm text-danger-500">{(mutation.error as Error).message}</p>
      )}

      <Button type="submit" disabled={mutation.isPending || !turnstileToken} className="w-full">
        {mutation.isPending ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}


