// supabase/functions/notify-new-request/index.ts
//
// Emails Manali when a client submits a new request (api-spec.md 4.2).
// Called by the frontend immediately after a successful `requests` insert.
// Email is sent through Brevo (see _shared/brevo.ts).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { escapeHtml, sendBrevoEmail } from "../_shared/brevo.ts";

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

  let payload: { requestId?: string };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }
  if (!payload.requestId) {
    return errorResponse("validation_error", "requestId is required.", 422);
  }

  // A client scoped to the CALLER's own JWT, not the service role. Row
  // Level Security (requests_select_own / requests_select_admin) decides
  // whether this caller may even see the request.
  const supabaseScoped = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );

  const { data: request, error: requestError } = await supabaseScoped
    .from("requests")
    .select(
      "id, request_number, service_category, description, preferred_contact_method, created_at, profiles(full_name, email, mobile_number)",
    )
    .eq("id", payload.requestId)
    .single();

  if (requestError || !request) {
    return errorResponse("not_found", "Request not found or not accessible.", 404);
  }

  const adminEmail = Deno.env.get("ADMIN_NOTIFICATION_EMAIL");
  if (adminEmail) {
    await sendBrevoEmail({
      to: adminEmail,
      replyTo: request.profiles.email,
      subject: `New request ${request.request_number} from ${request.profiles.full_name}`,
      html: `
        <p><strong>Request:</strong> ${escapeHtml(request.request_number)}</p>
        <p><strong>Client:</strong> ${escapeHtml(request.profiles.full_name)} (${escapeHtml(request.profiles.email)})</p>
        <p><strong>Mobile:</strong> ${escapeHtml(request.profiles.mobile_number ?? "-")}</p>
        <p><strong>Service:</strong> ${escapeHtml(request.service_category)}</p>
        <p><strong>Preferred contact:</strong> ${escapeHtml(request.preferred_contact_method)}</p>
        <p><strong>Description:</strong><br/>${escapeHtml(request.description).replace(/\n/g, "<br/>")}</p>
      `,
    });
  } else {
    console.error("ADMIN_NOTIFICATION_EMAIL is not set; no notification email was sent.");
  }

  return jsonResponse({ success: true });
});


