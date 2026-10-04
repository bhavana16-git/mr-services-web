// supabase/functions/submit-contact-form/index.ts
//
// Public Contact Us form (api-spec.md 4.1). Verifies a Turnstile token,
// re-validates the payload server-side, rate-limits by email, inserts with
// the service-role client (bypasses RLS), then emails Manali through Brevo.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(code: string, message: string, status: number, fields?: Record<string, string>) {
  return jsonResponse({ error: { code, message, ...(fields ? { fields } : {}) } }, status);
}

// ---------------------------------------------------------------------------
// Brevo email helpers
// ---------------------------------------------------------------------------

// Stops visitor-typed text (like "<script>") from becoming real HTML in the email.
function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

interface BrevoEmail {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
}

// Sends one email through Brevo's transactional API. Returns true on success.
// An HTTP failure is logged (visible in the Supabase function logs) and
// returns false, so a failed email can never break the main request.
async function sendBrevoEmail(email: BrevoEmail): Promise<boolean> {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "M. R. Services";

  if (!apiKey || !senderEmail) {
    console.error("Brevo is not configured: BREVO_API_KEY or BREVO_SENDER_EMAIL secret is missing.");
    return false;
  }

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: email.to, ...(email.toName ? { name: email.toName } : {}) }],
      subject: email.subject.replace(/[\r\n]+/g, " "),
      htmlContent: email.html,
      ...(email.replyTo ? { replyTo: email.replyTo } : {}),
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Brevo rejected the email (HTTP ${response.status}): ${details}`);
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Validation + Turnstile
// ---------------------------------------------------------------------------

const SERVICE_CATEGORIES = ["society_accounting", "business_accounting", "typing_services", "other"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+()\-\s]{7,20}$/;

interface ContactPayload {
  name: string;
  phone: string;
  email: string;
  service_interested_in: string;
  message: string;
  turnstileToken: string;
}

function validate(payload: Partial<ContactPayload>): Record<string, string> {
  const fields: Record<string, string> = {};

  if (!payload.name || payload.name.trim().length < 2 || payload.name.length > 100) {
    fields.name = "Enter a name between 2 and 100 characters.";
  }
  if (!payload.phone || !PHONE_RE.test(payload.phone)) {
    fields.phone = "Enter a valid phone number.";
  }
  if (!payload.email || !EMAIL_RE.test(payload.email) || payload.email.length > 200) {
    fields.email = "Enter a valid email address.";
  }
  if (!payload.service_interested_in || !SERVICE_CATEGORIES.includes(payload.service_interested_in)) {
    fields.service_interested_in = "Select a valid service.";
  }
  if (!payload.message || payload.message.trim().length < 5 || payload.message.length > 2000) {
    fields.message = "Message must be between 5 and 2000 characters.";
  }
  if (!payload.turnstileToken) {
    fields.turnstileToken = "Verification token missing.";
  }

  return fields;
}

async function verifyTurnstile(token: string, remoteIp: string | null): Promise<boolean> {
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) return false;

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteIp) body.set("remoteip", remoteIp);

  const resp = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const result = await resp.json();
  return result.success === true;
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Use POST.", 405);
  }

  let payload: Partial<ContactPayload>;
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }

  // Step 2: validate/sanitize fields server-side (mirrors the frontend Zod schema).
  const fieldErrors = validate(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse("validation_error", "Please check the highlighted fields.", 422, fieldErrors);
  }

  // Step 1: verify the Turnstile token before doing anything else.
  const remoteIp = req.headers.get("x-forwarded-for");
  const humanVerified = await verifyTurnstile(payload.turnstileToken as string, remoteIp);
  if (!humanVerified) {
    return errorResponse("captcha_failed", "Verification failed. Please try again.", 422);
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  // Step 3: rate-limit by email (max 3 submissions per 5 minutes).
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: recentCount } = await supabaseAdmin
    .from("contact_submissions")
    .select("*", { count: "exact", head: true })
    .eq("email", payload.email)
    .gte("created_at", fiveMinutesAgo);

  if ((recentCount ?? 0) >= 3) {
    return errorResponse("rate_limited", "Too many submissions. Please try again in a few minutes.", 429);
  }

  // Step 4: insert using the service-role client.
  const { data: inserted, error: insertError } = await supabaseAdmin
    .from("contact_submissions")
    .insert({
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      service_interested_in: payload.service_interested_in,
      message: payload.message,
    })
    .select()
    .single();

  if (insertError) {
    console.error("contact_submissions insert failed", insertError);
    return errorResponse("insert_failed", "Something went wrong. Please try again.", 500);
  }

  // Step 5: notify Manali through Brevo. A failed email must never fail the
  // whole request, because the submission is already safely stored.
  const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
  if (adminEmail) {
    try {
      await sendBrevoEmail({
        to: adminEmail,
        subject: `New contact form submission from ${payload.name}`,
        html: `
          <p><strong>Name:</strong> ${escapeHtml(payload.name)}</p>
          <p><strong>Phone:</strong> ${escapeHtml(payload.phone)}</p>
          <p><strong>Email:</strong> ${escapeHtml(payload.email)}</p>
          <p><strong>Service:</strong> ${escapeHtml(payload.service_interested_in)}</p>
          <p><strong>Message:</strong><br/>${escapeHtml(payload.message).replace(/\n/g, "<br/>")}</p>
        `,
        // Pressing "Reply" in Gmail answers the visitor directly.
        replyTo: { email: payload.email as string, name: payload.name as string },
      });
    } catch (emailError) {
      console.error("Brevo notification failed (submission was still saved)", emailError);
    }
  }

  // Step 6
  return jsonResponse({ success: true, id: inserted.id });
});


