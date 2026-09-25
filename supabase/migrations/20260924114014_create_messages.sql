create table public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id) on delete cascade, -- whose thread
  request_id uuid references public.requests(id) on delete set null,
  sender_id uuid not null references public.profiles(id),
  sender_role message_sender_role not null,
  body text not null,
  attachment_storage_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index idx_messages_client on public.messages(client_id);
create index idx_messages_created on public.messages(created_at);
