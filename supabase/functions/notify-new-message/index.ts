// supabase/functions/notify-new-message/index.ts
//
// Notifies the *other* side of a conversation when a new message arrives
// (api-spec.md 4.3), sending the email through Brevo. If a client sent the
// message, Manali is always emailed. If admin sent it, the client is emailed
// according to their own `notification_preference`.
//
// WhatsApp note: tech-stack.md 5 scopes WhatsApp to a click-to-chat wa.me
// link only, so this function cannot send a WhatsApp message. Where a client's
// preference is 'whatsapp' or 'both', the email half still goes out and the
// WhatsApp half is a deliberate no-op that is logged below.

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

  let payload: { messageId?: string };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }
  if (!payload.messageId) {
    return errorResponse("validation_error", "messageId is required.", 422);
  }

  // Scoped to the caller's JWT: Row Level Security decides whether this
  // caller may see the message at all.
  const supabaseScoped = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: message, error: messageError } = await supabaseScoped
    .from("messages")
    .select("id, client_id, sender_role, body, profiles(full_name, email, notification_preference)")
    .eq("id", payload.messageId)
    .single();

  if (messageError || !message) {
    return errorResponse("not_found", "Message not found or not accessible.", 404);
  }

  const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");

  if (message.sender_role === "client") {
    // Client -> admin: Manali is always emailed about a new client message.
    if (adminEmail) {
      try {
        await sendBrevoEmail({
          to: adminEmail,
          subject: `New message from ${message.profiles.full_name}`,
          html: `
            <p><strong>From:</strong> ${escapeHtml(message.profiles.full_name)} (${escapeHtml(message.profiles.email)})</p>
            <p><strong>Message:</strong><br/>${escapeHtml(message.body).replace(/\n/g, "<br/>")}</p>
          `,
          // Pressing "Reply" in Gmail answers the client directly.
          replyTo: { email: message.profiles.email, name: message.profiles.full_name },
        });
      } catch (emailError) {
        console.error("Brevo notification to admin failed", emailError);
      }
    }
  } else {
    // Admin -> client: respect the client's notification_preference.
    const preference = message.profiles.notification_preference as "email" | "whatsapp" | "both";
    const wantsEmail = preference === "email" || preference === "both";
    const wantsWhatsapp = preference === "whatsapp" || preference === "both";

    if (wantsEmail) {
      try {
        await sendBrevoEmail({
          to: message.profiles.email,
          toName: message.profiles.full_name,
          subject: "You have a new message from M. R. Services",
          html: `
            <p>Hi ${escapeHtml(message.profiles.full_name)},</p>
            <p>You have a new message from M. R. Services. Sign in to the Client Portal to read and reply.</p>
          `,
        });
      } catch (emailError) {
        console.error("Brevo notification to client failed", emailError);
      }
    }

    if (wantsWhatsapp) {
      // Deliberate no-op: see the file header. Logged so this gap is visible
      // in the Edge Function's own logs rather than silent.
      console.log(
        `notification_preference includes WhatsApp for client ${message.client_id}, ` +
          `but no WhatsApp send capability exists in this stack (tech-stack.md 5). ` +
          `No automated WhatsApp message was sent.`,
      );
    }
  }

  return jsonResponse({ success: true });
});




