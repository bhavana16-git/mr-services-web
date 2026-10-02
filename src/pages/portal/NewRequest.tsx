import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestFormSchema, type RequestFormInput } from "@/lib/validators/requestForm.schema";
import { useCreateRequest } from "@/hooks/useRequests";
import { useServicePackages } from "@/hooks/useServicePackages";
import Seo from "@/components/common/Seo";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/routes/routePaths";

export default function NewRequest() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data: packages } = useServicePackages();
  const createRequest = useCreateRequest();
  const [submitted, setSubmitted] = useState(false);

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm<RequestFormInput>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      packageId: searchParams.get("packageId"),
      preferredContactMethod: "whatsapp",
    },
  });

  async function onSubmit(values: RequestFormInput) {
    await createRequest.mutateAsync(values);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="p-6 lg:p-10">
        <div className="rounded-lg bg-teal-100 p-6 text-teal-500">
          <p className="font-medium">Thank you -- your request has been submitted.</p>
          <p className="mt-1 text-sm">
            We typically respond within one working day to confirm details, share a
            final quote if needed, and outline next steps. This request does not
            commit you to anything or involve any payment.
          </p>
        </div>
        <Button className="mt-6" onClick={() => navigate(ROUTES.portalRequests)}>
          Go to My Requests
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 max-w-2xl">
      <Seo title="Request New Work | M. R. Services Client Portal" description="Tell M. R. Services what you need and get a free, no-obligation quote." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Request New Work / Get a Quote</h1>
      <p className="mt-1 text-neutral-700">
        Tell us what you need, and we'll follow up with confirmation, a final quote
        if required, and next steps. No payment is collected on this form.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
        <div>
          <Label htmlFor="packageId">Select a Package</Label>
          <Select onValueChange={(v) => setValue("packageId", v === "custom" ? null : v)}
                  defaultValue={searchParams.get("packageId") ?? "custom"}>
            <SelectTrigger id="packageId"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="custom">Not sure / Custom Request</SelectItem>
              {packages?.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="serviceCategory">Service Category</Label>
          <Select onValueChange={(v) => setValue("serviceCategory", v as RequestFormInput["serviceCategory"])}>
            <SelectTrigger id="serviceCategory"><SelectValue placeholder="Choose a category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="society_accounting">Society Accounting</SelectItem>
              <SelectItem value="business_accounting">Business Accounting</SelectItem>
              <SelectItem value="typing_services">Typing Work</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.serviceCategory && <p className="mt-1 text-sm text-danger-500">Please choose a category.</p>}
        </div>

        <div>
          <Label htmlFor="description">Brief Description of Work</Label>
          <Textarea id="description" rows={4} {...register("description")} />
          {errors.description && <p className="mt-1 text-sm text-danger-500">{errors.description.message}</p>}
        </div>

        <div>
          <Label htmlFor="preferredStartDate">Preferred Start Date (optional)</Label>
          <Input id="preferredStartDate" type="date" {...register("preferredStartDate")} />
        </div>

        <div>
          <Label htmlFor="preferredContactMethod">Preferred Contact Method</Label>
          <Select onValueChange={(v) => setValue("preferredContactMethod", v as RequestFormInput["preferredContactMethod"])}
                  defaultValue="whatsapp">
            <SelectTrigger id="preferredContactMethod"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Call</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={createRequest.isPending} className="w-full">
          {createRequest.isPending ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
}


