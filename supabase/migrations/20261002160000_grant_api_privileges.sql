-- supabase/migrations/20261002160000_grant_api_privileges.sql
--
-- WHY THIS FILE EXISTS
-- Supabase no longer gives new tables in the "public" schema to the API roles
-- automatically. Without an explicit GRANT, Postgres answers
-- "42501 permission denied for table ..." BEFORE row level security (RLS) is
-- even checked. This migration writes down exactly what each role may do, so
-- staging and production always behave the same.
--
-- RLS stays the real gatekeeper: a GRANT only says "this role may attempt the
-- operation". Your policies in 20260101000900_rls_policies.sql still decide
-- which rows are allowed. Every statement below is safe to run twice.
--
-- The three roles:
--   anon          = a visitor who is not signed in
--   authenticated = a signed-in user (client or admin)
--   service_role  = Edge Functions only (never used in the browser)

-- 0. All three roles may look inside the public schema
grant usage on schema public to anon, authenticated, service_role;


-- 1. anon: take back everything, then give back only what the public site needs
revoke all on all tables in schema public from anon;

grant select on public.blog_posts   to anon;   -- /blog and the sitemap script
grant select on public.testimonials to anon;   -- Home page testimonials


-- 2. authenticated: exactly what the portal and the admin back office use
grant select, update                 on public.profiles                to authenticated;
grant select, insert, update, delete on public.service_packages        to authenticated;
grant select, insert, update, delete on public.service_package_features to authenticated;
grant select, insert, update, delete on public.requests                to authenticated;
grant select, insert, update, delete on public.request_internal_notes  to authenticated;
grant select, insert, update, delete on public.request_attachments     to authenticated;
grant select, insert, update, delete on public.documents               to authenticated;
grant select, insert, update         on public.messages                to authenticated;  -- no delete policy exists
grant select, update                 on public.contact_submissions     to authenticated;  -- admin reads and triages leads
grant select, insert, update, delete on public.blog_posts              to authenticated;
grant select, insert, update, delete on public.testimonials            to authenticated;


-- 3. service_role: the Edge Functions (submit-contact-form, notify-*)
grant select, insert, update, delete on all tables in schema public to service_role;


-- 4. The sequence behind request numbers (REQ-1000, REQ-1001, ...).
-- The trigger runs as the person creating the request, so that person needs it.
grant usage, select on sequence public.request_number_seq to authenticated, service_role;


-- 5. The helper used inside the RLS policies.
-- Several policies have no "to <role>" part, so Postgres also runs is_admin()
-- for anon visitors on blog_posts and testimonials. It only answers true/false.
grant execute on function public.is_admin(uuid) to anon, authenticated, service_role;



