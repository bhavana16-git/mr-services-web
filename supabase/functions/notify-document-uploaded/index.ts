// supabase/functions/notify-document-uploaded/index.ts
//
// Notifies a client, per their notification_preference, when admin uploads a
// new document to their account (api-spec.md 4.4, 3.4). The email is sent
// through Brevo. The same WhatsApp limitation as notify-new-message applies.

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

function errorResponse(code: string, message: string, status: number) {
  return jsonResponse({ error: { code, message } }, status);
}

// ---------------------------------------------------------------------------
// Brevo email helpers
// ---------------------------------------------------------------------------

// Stops user-typed text (like "<script>") from becoming real HTML in the email.
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
// Handler
// ---------------------------------------------------------------------------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return errorResponse("method_not_allowed", "Use POST.", 405);
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return errorResponse("unauthorized", "Missing Authorization header.", 401);
  }

  let payload: { documentId?: string };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }
  if (!payload.documentId) {
    return errorResponse("validation_error", "documentId is required.", 422);
  }

  // Scoped to the caller's JWT. In practice this is always admin (only the
  // admin policy permits the document insert this function follows). A client
  // calling this directly would get zero rows back and a clean 404, never
  // another client's document.
  const supabaseScoped = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: document, error: documentError } = await supabaseScoped
    .from("documents")
    .select("id, title, category, client_id, profiles(full_name, email, notification_preference)")
    .eq("id", payload.documentId)
    .single();

  if (documentError || !document) {
    return errorResponse("not_found", "Document not found or not accessible.", 404);
  }

  const preference = document.profiles.notification_preference as "email" | "whatsapp" | "both";
  const wantsEmail = preference === "email" || preference === "both";
  const wantsWhatsapp = preference === "whatsapp" || preference === "both";

  if (wantsEmail) {
    try {
      await sendBrevoEmail({
        to: document.profiles.email,
        toName: document.profiles.full_name,
        subject: "A new document is available in your Client Portal",
        html: `
          <p>Hi ${escapeHtml(document.profiles.full_name)},</p>
          <p>A new document, "<strong>${escapeHtml(document.title)}</strong>" (${escapeHtml(document.category)}),
             has been added to your account. Sign in to the Client Portal to view or download it.</p>
        `,
      });
    } catch (emailError) {
      console.error("Brevo notification failed (document was still saved)", emailError);
    }
  }

  if (wantsWhatsapp) {
    console.log(
      `notification_preference includes WhatsApp for client ${document.client_id}, ` +
        `but no WhatsApp send capability exists in this stack (tech-stack.md 5). ` +
        `No automated WhatsApp message was sent.`,
    );
  }

  return jsonResponse({ success: true });
});

