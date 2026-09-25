alter table public.profiles enable row level security;
alter table public.service_packages enable row level security;
alter table public.service_package_features enable row level security;
alter table public.requests enable row level security;
alter table public.request_internal_notes enable row level security;
alter table public.request_attachments enable row level security;
alter table public.documents enable row level security;
alter table public.messages enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;




create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_select_admin" on public.profiles
  for select using (public.is_admin(auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id)
  with check (auth.uid() = id and role = 'client');

create policy "profiles_update_admin" on public.profiles
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));




  create policy "packages_read_active" on public.service_packages
  for select to authenticated using (is_active = true);

create policy "packages_admin_all" on public.service_packages
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "package_features_read_active" on public.service_package_features
  for select to authenticated using (
    exists (
      select 1 from public.service_packages sp
      where sp.id = package_id and sp.is_active = true
    )
  );

create policy "package_features_admin_all" on public.service_package_features
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));






  create policy "requests_select_own" on public.requests
  for select using (auth.uid() = client_id);

create policy "requests_select_admin" on public.requests
  for select using (public.is_admin(auth.uid()));

create policy "requests_insert_own" on public.requests
  for insert with check (auth.uid() = client_id);

create policy "requests_update_own_limited" on public.requests
  for update using (auth.uid() = client_id)
  with check (auth.uid() = client_id and status = 'received');

create policy "requests_update_admin" on public.requests
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "requests_delete_admin" on public.requests
  for delete using (public.is_admin(auth.uid()));

create policy "request_notes_admin_all" on public.request_internal_notes
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));






  create policy "attachments_select_own" on public.request_attachments
  for select using (
    exists (
      select 1 from public.requests r
      where r.id = request_id and r.client_id = auth.uid()
    )
  );

create policy "attachments_insert_own" on public.request_attachments
  for insert with check (
    exists (
      select 1 from public.requests r
      where r.id = request_id and r.client_id = auth.uid()
    )
  );

create policy "attachments_admin_all" on public.request_attachments
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));






  create policy "documents_select_own" on public.documents
  for select using (auth.uid() = client_id);

create policy "documents_admin_all" on public.documents
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));







  create policy "messages_select_own" on public.messages
  for select using (auth.uid() = client_id);

create policy "messages_select_admin" on public.messages
  for select using (public.is_admin(auth.uid()));

create policy "messages_insert_own" on public.messages
  for insert with check (
    auth.uid() = client_id and sender_id = auth.uid() and sender_role = 'client'
  );

create policy "messages_insert_admin" on public.messages
  for insert with check (
    public.is_admin(auth.uid()) and sender_id = auth.uid() and sender_role = 'admin'
  );

create policy "messages_update_own" on public.messages
  for update using (auth.uid() = client_id)
  with check (auth.uid() = client_id);

create policy "messages_update_admin" on public.messages
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));










  -- Not enabled: api-spec.md 4.1 recommends the hardened production path
-- below (the submit-contact-form Edge Function, service-role insert)
-- instead of a direct anon policy. Left here only as the documented
-- fallback from security.md 3.2, should the Edge Function ever be
-- bypassed for a lower-security environment.
--
-- create policy "contact_public_insert" on public.contact_submissions
--   for insert to anon with check (true);

create policy "contact_admin_select" on public.contact_submissions
  for select using (public.is_admin(auth.uid()));

create policy "contact_admin_update" on public.contact_submissions
  for update using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));







  create policy "blog_read_published" on public.blog_posts
  for select using (is_published = true);

create policy "blog_admin_all" on public.blog_posts
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));

create policy "testimonials_read_active" on public.testimonials
  for select using (is_active = true);

create policy "testimonials_admin_all" on public.testimonials
  for all using (public.is_admin(auth.uid()))
  with check (public.is_admin(auth.uid()));







  insert into storage.buckets (id, name, public)
values
  ('documents', 'documents', false),
  ('request-attachments', 'request-attachments', false),
  ('blog-images', 'blog-images', true),
  ('avatars', 'avatars', true)
on conflict (id) do nothing;









-- documents: private, client reads only their own folder
create policy "storage_documents_select_own" on storage.objects
  for select to authenticated using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_documents_admin_all" on storage.objects
  for all to authenticated using (
    bucket_id = 'documents' and public.is_admin(auth.uid())
  )
  with check (
    bucket_id = 'documents' and public.is_admin(auth.uid())
  );

-- request-attachments: private, client reads/writes only their own folder
create policy "storage_attachments_select_own" on storage.objects
  for select to authenticated using (
    bucket_id = 'request-attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_attachments_insert_own" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'request-attachments' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_attachments_admin_all" on storage.objects
  for all to authenticated using (
    bucket_id = 'request-attachments' and public.is_admin(auth.uid())
  )
  with check (
    bucket_id = 'request-attachments' and public.is_admin(auth.uid())
  );

-- blog-images: public read, admin-only write
create policy "storage_blog_images_public_read" on storage.objects
  for select using (bucket_id = 'blog-images');

create policy "storage_blog_images_admin_write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'blog-images' and public.is_admin(auth.uid())
  );

create policy "storage_blog_images_admin_update" on storage.objects
  for update to authenticated using (
    bucket_id = 'blog-images' and public.is_admin(auth.uid())
  );

create policy "storage_blog_images_admin_delete" on storage.objects
  for delete to authenticated using (
    bucket_id = 'blog-images' and public.is_admin(auth.uid())
  );

-- avatars: public read, owner-only write
create policy "storage_avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "storage_avatars_owner_write" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "storage_avatars_owner_update" on storage.objects
  for update to authenticated using (
    bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text
  );














  