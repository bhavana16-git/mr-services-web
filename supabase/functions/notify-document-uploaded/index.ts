// supabase/functions/notify-document-uploaded/index.ts
//
// Notifies a client, per their notification_preference, when admin
// uploads a new document to their account (api-spec.md 4.4, 3.4).
// Same WhatsApp limitation as notify-new-message applies here.
// Email sending now uses Brevo instead of Resend.

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

  let payload: { documentId?: string };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }
  if (!payload.documentId) {
    return errorResponse("validation_error", "documentId is required.", 422);
  }

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
      await sendEmail(
        document.profiles.email,
        "A new document is available in your Client Portal",
        `
          <p>Hi ${document.profiles.full_name},</p>
          <p>A new document, "<strong>${document.title}</strong>" (${document.category}),
             has been added to your account. Sign in to the Client Portal to view or download it.</p>
        `,
      );
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



