create table public.requests (
  id uuid primary key default gen_random_uuid(),
  request_number text not null unique,        -- human-readable, e.g. "REQ-1042"
  client_id uuid not null references public.profiles(id) on delete cascade,
  package_id uuid references public.service_packages(id) on delete set null,
  service_category service_category not null,
  description text not null,
  preferred_start_date date,
  preferred_contact_method preferred_contact_method not null default 'call',
  status request_status not null default 'received',
  internal_notes text,                         -- superseded by request_internal_notes below;
                                                -- kept nullable for schema completeness, never
                                                -- exposed to the client by any RLS policy
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_requests_client on public.requests(client_id);
create index idx_requests_status on public.requests(status);

-- Recommended split from database-schema.md 3.4a: RLS secures rows, not
-- individual columns, so admin-only free-text notes get their own table
-- with its own admin-only policy, instead of relying on a column-level
-- exception that Postgres RLS cannot actually express.
create table public.request_internal_notes (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  author_id uuid not null references public.profiles(id),
  note text not null,
  created_at timestamptz not null default now()
);

create index idx_request_notes_request on public.request_internal_notes(request_id);

create table public.request_attachments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests(id) on delete cascade,
  storage_path text not null,       -- path within the request-attachments bucket
  file_name text not null,
  file_size_bytes bigint,
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

create index idx_request_attachments_request on public.request_attachments(request_id);

