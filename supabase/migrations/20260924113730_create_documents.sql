create table public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade,
  request_id uuid references public.requests(id) on delete set null,
  title text not null,
  category document_category not null,
  storage_path text not null,        -- path within the documents bucket
  file_size_bytes bigint,
  uploaded_by uuid not null references public.profiles(id), -- admin who uploaded it
  created_at timestamptz not null default now()
);

create index idx_documents_client on public.documents(client_id);
create index idx_documents_category on public.documents(category);
