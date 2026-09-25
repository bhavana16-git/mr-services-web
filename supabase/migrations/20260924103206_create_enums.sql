-- User role: drives which app shell (/portal/* vs /admin/*) a signed-in
-- user sees, and which RLS policies apply to them.
create type user_role as enum ('client', 'admin');

-- A client work request moves through exactly these three stages.
create type request_status as enum ('received', 'in_progress', 'completed');

-- The three service lines the business offers.
create type service_category as enum (
  'society_accounting',
  'business_accounting',
  'typing_services',
  'other'
);

-- How an uploaded/shared document is categorized on the Documents page.
create type document_category as enum (
  'society_accounting',
  'business_accounting',
  'typing',
  'other'
);

-- Triage status for public Contact Us submissions.
create type contact_status as enum ('new', 'contacted', 'closed');

-- A client's preferred channel for notifications (My Profile page).
create type notification_preference as enum ('email', 'whatsapp', 'both');

-- Preferred contact method on the Request New Work form.
create type preferred_contact_method as enum ('call', 'whatsapp', 'email');

-- Which side of a conversation a message came from.
create type message_sender_role as enum ('client', 'admin');

-- The three package categories on the Service Packages page.
create type package_category as enum (
  'society_accounting',
  'business_accounting',
  'typing_services'
);
