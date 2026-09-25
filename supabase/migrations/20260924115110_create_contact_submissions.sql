create table public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text not null,
  service_interested_in service_category not null,
  message text not null,
  status contact_status not null default 'new',
  linked_client_id uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create index idx_contact_submissions_status on public.contact_submissions(status);
