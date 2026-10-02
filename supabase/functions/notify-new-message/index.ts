// supabase/functions/notify-new-message/index.ts
//
// Notifies the other side of a conversation when a new message arrives.
//  - A client wrote the message: Manali is always emailed.
//  - Admin wrote the message: the client is emailed if their notification_preference allows it.
// WhatsApp messages are not sent automatically (this project only uses wa.me click-to-chat links).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("SITE_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// The optional secret FROM_EMAIL changes the sender address without editing code.
const FROM_ADDRESS =
  Deno.env.get("FROM_EMAIL") ?? "M. R. Services Website <notifications@mrservicesindia.com>";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(code: string, message: string, status: number) {
  return jsonResponse({ error: { code, message } }, status);
}

// Stops text typed by a user from being treated as HTML inside the email.
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(resendApiKey: string, to: string, subject: string, html: string) {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM_ADDRESS, to: [to], subject, html }),
  });
  if (response.ok) {
    console.log(`Email sent to ${to}`);
  } else {
    console.error("Resend rejected the email:", response.status, await response.text());
  }
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

  // Runs as the signed-in caller, so the database rules decide what they may see.
  const supabaseScoped = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  // "profiles!client_id" says which of the two links to profiles to follow (the client's).
  const { data: message, error: messageError } = await supabaseScoped
    .from("messages")
    .select("id, client_id, sender_role, body, profiles!client_id(full_name, email, notification_preference)")
    .eq("id", payload.messageId)
    .single();

  if (messageError || !message) {
    console.error("Could not load the message:", messageError);
    return errorResponse("not_found", "Message not found or not accessible.", 404);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
  const client = message.profiles;

  if (!resendApiKey) {
    console.error("The RESEND_API_KEY secret is not set. No email was sent.");
    return jsonResponse({ success: true });
  }

  if (message.sender_role === "client") {
    // Client -> admin: Manali is always emailed.
    if (adminEmail) {
      try {
        await sendEmail(
          resendApiKey,
          adminEmail,
          `New message from ${client.full_name}`,
          `<p><strong>From:</strong> ${escapeHtml(client.full_name)} (${escapeHtml(client.email)})</p>
           <p><strong>Message:</strong><br/>${escapeHtml(message.body)}</p>`,
        );
      } catch (emailError) {
        console.error("Sending the email to admin failed:", emailError);
      }
    } else {
      console.error("The ADMIN_NOTIFICATION_EMAIL secret is not set. No email was sent.");
    }
  } else {
    // Admin -> client: respect the client's notification_preference.
    const preference = client.notification_preference as "email" | "whatsapp" | "both";
    const wantsEmail = preference === "email" || preference === "both";
    const wantsWhatsapp = preference === "whatsapp" || preference === "both";

    if (wantsEmail) {
      try {
        await sendEmail(
          resendApiKey,
          client.email,
          "You have a new message from M. R. Services",
          `<p>Hi ${escapeHtml(client.full_name)},</p>
           <p>You have a new message from M. R. Services. Sign in to the Client Portal to read and reply.</p>`,
        );
      } catch (emailError) {
        console.error("Sending the email to the client failed:", emailError);
      }
    }

    if (wantsWhatsapp) {
      console.log(
        `Client ${message.client_id} prefers WhatsApp, but this project cannot send WhatsApp messages automatically.`,
      );
    }
  }

  return jsonResponse({ success: true });
});


