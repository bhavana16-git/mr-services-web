// supabase/functions/notify-new-message/index.ts
//
// Notifies the *other* side of a conversation when a new message arrives
// (api-spec.md 4.3). If a client sent the message, Manali is always
// emailed (mirrors notify-new-request). If admin sent it, the client is
// notified according to their own `notification_preference`.
// Email sending now uses Brevo instead of Resend.
//
// WhatsApp note: tech-stack.md 5 scopes WhatsApp integration to a
// click-to-chat `wa.me` link only -- there is no WhatsApp Business API in
// this stack, so this function cannot actually *send* a WhatsApp message.
// Where a client's preference is 'whatsapp' or 'both', the email half (if
// applicable) still goes out, and the WhatsApp half is a deliberate no-op,
// documented inline below rather than silently pretending to send one.

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

async function sendEmail(to: string, subject: string, html: string) {
  const apiKey = Deno.env.get("BREVO_API_KEY");
  const senderEmail = Deno.env.get("BREVO_SENDER_EMAIL");
  const senderName = Deno.env.get("BREVO_SENDER_NAME") ?? "M. R. Services Website";
  if (!apiKey || !senderEmail) return;

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({
      sender: { name: senderName, email: senderEmail },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
}

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
        await sendEmail(
          adminEmail,
          `New message from ${message.profiles.full_name}`,
          `<p><strong>From:</strong> ${message.profiles.full_name} (${message.profiles.email})</p>
           <p><strong>Message:</strong><br/>${message.body}</p>`,
        );
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
        await sendEmail(
          message.profiles.email,
          "You have a new message from M. R. Services",
          `<p>Hi ${message.profiles.full_name},</p>
           <p>You have a new message from M. R. Services. Sign in to the Client Portal to read and reply.</p>`,
        );
      } catch (emailError) {
        console.error("Brevo notification to client failed", emailError);
      }
    }

    if (wantsWhatsapp) {
      console.log(
        `notification_preference includes WhatsApp for client ${message.client_id}, ` +
          `but no WhatsApp send capability exists in this stack (tech-stack.md 5). ` +
          `No automated WhatsApp message was sent.`,
      );
    }
  }

  return jsonResponse({ success: true });
});


