create table public.service_packages (
  id uuid primary key default gen_random_uuid(),
  category package_category not null,
  name text not null,                        -- e.g. "Society Standard"
  slug text not null unique,                 -- e.g. "society-standard"
  best_for text not null,                    -- e.g. "31-75 flats"
  description text,
  starting_price numeric(10,2) not null,     -- e.g. 6000.00
  price_unit text not null default 'per month',
  turnaround text not null,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_service_packages_category on public.service_packages(category);
create index idx_service_packages_active on public.service_packages(is_active);

create table public.service_package_features (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.service_packages(id) on delete cascade,
  feature_text text not null,
  sort_order integer not null default 0
);

create index idx_package_features_package on public.service_package_features(package_id);

