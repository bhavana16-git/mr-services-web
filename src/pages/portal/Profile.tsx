import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileFormSchema, type ProfileFormInput } from "@/lib/validators/profileForm.schema";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function Profile() {
  const { profile, session, signOut, refreshProfile } = useAuth();
  const [saved, setSaved] = useState(false);

  const {
    register, handleSubmit, setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: profile?.full_name,
      mobileNumber: profile?.mobile_number,
      societyOrBusinessName: profile?.society_or_business_name ?? "",
      notificationPreference: profile?.notification_preference ?? "email",
    },
  });

  async function onSubmit(values: ProfileFormInput) {
    if (!session) return;
    await supabase.from("profiles").update({
      full_name: values.fullName,
      mobile_number: values.mobileNumber,
      society_or_business_name: values.societyOrBusinessName || null,
      notification_preference: values.notificationPreference,
    }).eq("id", session.user.id);
    await refreshProfile();
    setSaved(true);
  }

  return (
    <div className="p-6 lg:p-10 max-w-xl">
      <Seo title="My Profile | M. R. Services Client Portal" description="Manage your M. R. Services account details." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">My Profile</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register("fullName")} />
          {errors.fullName && <p className="mt-1 text-sm text-danger-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <Label>Email Address</Label>
          <Input value={profile?.email ?? ""} disabled />
        </div>
        <div>
          <Label htmlFor="mobileNumber">Mobile Number</Label>
          <Input id="mobileNumber" {...register("mobileNumber")} />
        </div>
        <div>
          <Label htmlFor="societyOrBusinessName">Society/Business Name</Label>
          <Input id="societyOrBusinessName" {...register("societyOrBusinessName")} />
        </div>
        <div>
          <Label htmlFor="notificationPreference">Notification Preferences</Label>
          <Select
            defaultValue={profile?.notification_preference ?? "email"}
            onValueChange={(v) => setValue("notificationPreference", v as ProfileFormInput["notificationPreference"])}
          >
            <SelectTrigger id="notificationPreference"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="both">Both</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {saved && <p className="text-sm text-teal-500">Your profile has been updated.</p>}

        <Button type="submit" disabled={isSubmitting}>Save Changes</Button>
      </form>

      <button onClick={() => signOut()} className="mt-8 text-sm text-neutral-400 underline">
        Log Out
      </button>
    </div>
  );
}


