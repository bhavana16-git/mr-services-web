// supabase/functions/notify-document-uploaded/index.ts
//
// Emails a client, if their notification_preference allows it, when admin uploads a
// document to their account. WhatsApp is not sent automatically.

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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

  // "profiles!client_id" says which of the two links to profiles to follow (the client's).
  const { data: document, error: documentError } = await supabaseScoped
    .from("documents")
    .select("id, title, category, client_id, profiles!client_id(full_name, email, notification_preference)")
    .eq("id", payload.documentId)
    .single();

  if (documentError || !document) {
    console.error("Could not load the document:", documentError);
    return errorResponse("not_found", "Document not found or not accessible.", 404);
  }

  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.error("The RESEND_API_KEY secret is not set. No email was sent.");
    return jsonResponse({ success: true });
  }

  const client = document.profiles;
  const preference = client.notification_preference as "email" | "whatsapp" | "both";
  const wantsEmail = preference === "email" || preference === "both";
  const wantsWhatsapp = preference === "whatsapp" || preference === "both";

  if (wantsEmail) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: FROM_ADDRESS,
          to: [client.email],
          subject: "A new document is available in your Client Portal",
          html: `
            <p>Hi ${escapeHtml(client.full_name)},</p>
            <p>A new document, "<strong>${escapeHtml(document.title)}</strong>"
               (${escapeHtml(String(document.category).replace(/_/g, " "))}), has been added to your account.
               Sign in to the Client Portal to view or download it.</p>
          `,
        }),
      });
      if (response.ok) {
        console.log(`Email sent to ${client.email}`);
      } else {
        console.error("Resend rejected the email:", response.status, await response.text());
      }
    } catch (emailError) {
      console.error("Sending the email failed (the document was still saved):", emailError);
    }
  }

  if (wantsWhatsapp) {
    console.log(
      `Client ${document.client_id} prefers WhatsApp, but this project cannot send WhatsApp messages automatically.`,
    );
  }

  return jsonResponse({ success: true });
});

