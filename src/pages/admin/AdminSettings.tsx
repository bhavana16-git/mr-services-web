import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabaseClient";
import Seo from "@/components/common/Seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Feedback = { type: "ok" | "error"; text: string } | null;

function FeedbackMessage({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  return (
    <p className={`text-sm ${feedback.type === "ok" ? "text-teal-500" : "text-danger-500"}`}>
      {feedback.text}
    </p>
  );
}

export default function AdminSettings() {
  const { profile, session, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [mobile, setMobile] = useState(profile?.mobile_number ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileFeedback, setProfileFeedback] = useState<Feedback>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordFeedback, setPasswordFeedback] = useState<Feedback>(null);

  async function saveProfile() {
    if (!session) return;
    setProfileFeedback(null);
    if (fullName.trim().length < 2) {
      setProfileFeedback({ type: "error", text: "Please enter your full name." });
      return;
    }
    setSavingProfile(true);
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), mobile_number: mobile.trim() || null })
      .eq("id", session.user.id)
      .select("id");
    setSavingProfile(false);
    if (error) {
      setProfileFeedback({ type: "error", text: error.message });
      return;
    }
    if (!data || data.length === 0) {
      setProfileFeedback({ type: "error", text: "Nothing was saved. Please sign out, sign in and try again." });
      return;
    }
    await refreshProfile();
    setProfileFeedback({ type: "ok", text: "Your details have been updated." });
  }

  async function changePassword() {
    setPasswordFeedback(null);
    if (newPassword.length < 8) {
      setPasswordFeedback({ type: "error", text: "The password must be at least 8 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordFeedback({ type: "error", text: "The two passwords do not match." });
      return;
    }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) {
      setPasswordFeedback({ type: "error", text: error.message });
      return;
    }
    setNewPassword("");
    setConfirmPassword("");
    setPasswordFeedback({ type: "ok", text: "Password changed. Use the new password the next time you sign in." });
  }

  return (
    <div className="max-w-xl p-6 lg:p-10">
      <Seo title="Settings | M. R. Services Admin" description="Your admin account details." />
      <h1 className="font-heading text-2xl font-bold text-neutral-900">Settings</h1>

      <div className="mt-8 space-y-5 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-neutral-900">Your details</h2>
        <div>
          <Label htmlFor="admin-name">Full name</Label>
          <Input id="admin-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="admin-email">Email address</Label>
          <Input id="admin-email" value={profile?.email ?? ""} disabled />
          <p className="mt-1 text-xs text-neutral-400">
            Your sign-in email cannot be changed here. Notification emails go to the address stored
            in the ADMIN_NOTIFICATION_EMAIL secret.
          </p>
        </div>
        <div>
          <Label htmlFor="admin-mobile">Mobile number</Label>
          <Input id="admin-mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} />
        </div>
        <FeedbackMessage feedback={profileFeedback} />
        <Button onClick={saveProfile} disabled={savingProfile}>
          {savingProfile ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="mt-8 space-y-5 rounded-lg border border-neutral-200 bg-white p-5">
        <h2 className="font-heading text-lg font-semibold text-neutral-900">Change password</h2>
        <div>
          <Label htmlFor="new-password">New password (at least 8 characters)</Label>
          <Input
            id="new-password"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirm new password</Label>
          <Input
            id="confirm-password"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <FeedbackMessage feedback={passwordFeedback} />
        <Button onClick={changePassword} disabled={savingPassword}>
          {savingPassword ? "Changing..." : "Change password"}
        </Button>
      </div>
    </div>
  );
}


