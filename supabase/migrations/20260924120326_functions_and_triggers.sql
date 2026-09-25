create sequence public.request_number_seq start 1000;

create or replace function public.generate_request_number()
returns trigger language plpgsql as $$
begin
  new.request_number := 'REQ-' || nextval('public.request_number_seq');
  return new;
end;
$$;

create trigger trg_set_request_number
before insert on public.requests
for each row
when (new.request_number is null)
execute function public.generate_request_number();



create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

create trigger trg_service_packages_updated_at before update on public.service_packages
for each row execute function public.set_updated_at();

create trigger trg_requests_updated_at before update on public.requests
for each row execute function public.set_updated_at();

create trigger trg_blog_posts_updated_at before update on public.blog_posts
for each row execute function public.set_updated_at();



create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, email, mobile_number, society_or_business_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'mobile_number',
    new.raw_user_meta_data->>'society_or_business_name',
    'client'
  );
  return new;
end;
$$;

create trigger trg_on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();




create or replace function public.is_admin(uid uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = uid and role = 'admin'
  );
$$;