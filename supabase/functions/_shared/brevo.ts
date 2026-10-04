// supabase/functions/_shared/brevo.ts
//
// One small helper that every notification function uses to send email
// through Brevo's HTTP API (https://api.brevo.com/v3/smtp/email).
//
// It NEVER throws. If the email cannot be sent it writes the reason to the
// function log and returns false, so a failed email can never break the
// real request (the contact form row, the new request, etc. is already saved).
//
// Secrets it reads (set with `supabase secrets set`, never in code):
//   BREVO_API_KEY       the key that starts with xkeysib-
//   BREVO_SENDER_EMAIL  the sender address verified in Brevo
//   BREVO_SENDER_NAME   optional display name

interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

// Turns text typed by a visitor into safe HTML, so nobody can put links or
// tags inside the emails Manali receives.
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendBrevoEmail(input: SendEmailInput): Promise<boolean> {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "M. R. Services Website";

  if (!apiKey || !senderEmail) {
    console.error(
      "Brevo is not configured: set the BREVO_API_KEY and BREVO_SENDER_EMAIL secrets.",
    );
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: senderName, email: senderEmail },
        to: [{ email: input.to }],
        subject: input.subject,
        htmlContent: input.html,
        ...(input.replyTo ? { replyTo: { email: input.replyTo } } : {}),
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error(`Brevo rejected the email (HTTP ${response.status}): ${detail}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Could not reach Brevo", error);
    return false;
  }
}



