// supabase/functions/notify-new-request/index.ts
//
// Emails Manali (through Brevo) when a client submits a new request
// (api-spec.md 4.2). Called by the frontend immediately after a successful
// `requests` insert.

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

  let payload: { requestId?: string };
  try {
    payload = await req.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.", 400);
  }
  if (!payload.requestId) {
    return errorResponse("validation_error", "requestId is required.", 422);
  }

  // A client scoped to the CALLER's own JWT, not the service role. Row Level
  // Security decides whether this caller may even see the request, which
  // satisfies api-spec.md 4's "verify the caller's JWT matches the resource
  // owner" requirement without duplicating that logic here.
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
    try {
      await sendBrevoEmail({
        to: adminEmail,
        subject: `New request ${request.request_number} from ${request.profiles.full_name}`,
        html: `
          <p><strong>Request:</strong> ${escapeHtml(request.request_number)}</p>
          <p><strong>Client:</strong> ${escapeHtml(request.profiles.full_name)} (${escapeHtml(request.profiles.email)})</p>
          <p><strong>Mobile:</strong> ${escapeHtml(request.profiles.mobile_number ?? "-")}</p>
          <p><strong>Service:</strong> ${escapeHtml(request.service_category)}</p>
          <p><strong>Preferred contact:</strong> ${escapeHtml(request.preferred_contact_method)}</p>
          <p><strong>Description:</strong><br/>${escapeHtml(request.description).replace(/\n/g, "<br/>")}</p>
        `,
        // Pressing "Reply" in Gmail answers the client directly.
        replyTo: { email: request.profiles.email, name: request.profiles.full_name },
      });
    } catch (emailError) {
      console.error("Brevo notification failed (request was still created)", emailError);
    }
  }

  return jsonResponse({ success: true });
});


