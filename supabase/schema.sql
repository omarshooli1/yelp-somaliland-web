create extension if not exists "pgcrypto";

create table if not exists public.businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (
    category in (
      'restaurants',
      'cafes',
      'hotels',
      'pharmacies',
      'clinics',
      'gyms',
      'barbers',
      'supermarkets'
    )
  ),
  description text not null default '',
  phone text,
  whatsapp text,
  address text not null,
  city text not null default 'Hargeisa',
  latitude double precision,
  longitude double precision,
  images text[] not null default '{}',
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  user_id uuid,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  name text not null,
  description text not null default '',
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  image text,
  available boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.delivery_orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  delivery_address text not null,
  delivery_latitude double precision,
  delivery_longitude double precision,
  items jsonb not null default '[]'::jsonb,
  subtotal_usd numeric(10, 2) not null default 0 check (subtotal_usd >= 0),
  delivery_fee_usd numeric(10, 2) not null default 0 check (delivery_fee_usd >= 0),
  total_usd numeric(10, 2) not null default 0 check (total_usd >= 0),
  status text not null default 'open' check (
    status in ('open', 'accepted', 'picked_up', 'delivered', 'cancelled')
  ),
  driver_id uuid,
  driver_name text,
  driver_phone text,
  accepted_at timestamptz,
  picked_up_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  seller_name text not null,
  seller_phone text not null,
  title text not null,
  category text not null,
  description text not null default '',
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  city text not null default 'Hargeisa',
  address text,
  latitude double precision,
  longitude double precision,
  images text[] not null default '{}',
  status text not null default 'active' check (status in ('active', 'sold', 'paused', 'removed')),
  verified_seller boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete set null,
  owner_user_id uuid,
  vendor_name text not null,
  owner_name text not null,
  phone text not null,
  whatsapp text,
  email text,
  description text not null default '',
  city text not null default 'Hargeisa',
  address text,
  latitude double precision,
  longitude double precision,
  logo_url text,
  cover_url text,
  rating numeric(2, 1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  verified boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'active', 'paused', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products
add column if not exists vendor_id uuid references public.vendors(id) on delete set null;

create table if not exists public.product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references public.products(id) on delete cascade,
  vendor_id uuid references public.vendors(id) on delete cascade,
  reviewer_name text not null,
  reviewer_phone text,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text not null default '',
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (product_id is not null or vendor_id is not null)
);

create table if not exists public.marketplace_orders (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  buyer_name text not null,
  buyer_phone text not null,
  buyer_address text,
  quantity integer not null default 1 check (quantity > 0),
  total_usd numeric(10, 2) not null check (total_usd >= 0),
  status text not null default 'new' check (status in ('new', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_name text not null,
  page_path text,
  entity_type text,
  entity_id text,
  search_query text,
  category text,
  city text,
  latitude double precision,
  longitude double precision,
  metadata jsonb not null default '{}'::jsonb,
  consent_granted boolean not null default false,
  anonymous_id text,
  user_id uuid,
  created_at timestamptz not null default now()
);

create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text,
  user_id uuid,
  consent_type text not null,
  granted boolean not null,
  source text not null default 'web_app',
  created_at timestamptz not null default now()
);

create table if not exists public.taxi_rides (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_phone text not null,
  pickup_address text not null,
  pickup_latitude double precision,
  pickup_longitude double precision,
  dropoff_address text not null,
  dropoff_latitude double precision,
  dropoff_longitude double precision,
  city text not null default 'Hargeisa',
  passenger_count integer not null default 1 check (passenger_count > 0),
  notes text not null default '',
  estimated_fare_usd numeric(10, 2),
  status text not null default 'open' check (
    status in ('open', 'accepted', 'arrived', 'in_progress', 'completed', 'cancelled')
  ),
  driver_id uuid,
  driver_name text,
  driver_phone text,
  vehicle_label text,
  accepted_at timestamptz,
  arrived_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists businesses_category_idx on public.businesses(category);
create index if not exists businesses_city_idx on public.businesses(city);
create index if not exists businesses_rating_idx on public.businesses(rating desc);
create index if not exists reviews_business_id_idx on public.reviews(business_id);
create index if not exists menu_items_business_id_idx on public.menu_items(business_id);
create index if not exists delivery_orders_status_idx on public.delivery_orders(status);
create index if not exists delivery_orders_business_id_idx on public.delivery_orders(business_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists products_category_idx on public.products(category);
create index if not exists products_city_idx on public.products(city);
create index if not exists products_vendor_id_idx on public.products(vendor_id);
create index if not exists vendors_status_idx on public.vendors(status);
create index if not exists vendors_city_idx on public.vendors(city);
create index if not exists product_reviews_product_id_idx on public.product_reviews(product_id);
create index if not exists product_reviews_vendor_id_idx on public.product_reviews(vendor_id);
create index if not exists marketplace_orders_product_id_idx on public.marketplace_orders(product_id);
create index if not exists analytics_events_event_name_idx on public.analytics_events(event_name);
create index if not exists analytics_events_created_at_idx on public.analytics_events(created_at desc);
create index if not exists user_consents_anonymous_id_idx on public.user_consents(anonymous_id);
create index if not exists taxi_rides_status_idx on public.taxi_rides(status);
create index if not exists taxi_rides_city_idx on public.taxi_rides(city);
create index if not exists taxi_rides_created_at_idx on public.taxi_rides(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists businesses_set_updated_at on public.businesses;
create trigger businesses_set_updated_at
before update on public.businesses
for each row execute function public.set_updated_at();

drop trigger if exists reviews_set_updated_at on public.reviews;
create trigger reviews_set_updated_at
before update on public.reviews
for each row execute function public.set_updated_at();

drop trigger if exists menu_items_set_updated_at on public.menu_items;
create trigger menu_items_set_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists delivery_orders_set_updated_at on public.delivery_orders;
create trigger delivery_orders_set_updated_at
before update on public.delivery_orders
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists vendors_set_updated_at on public.vendors;
create trigger vendors_set_updated_at
before update on public.vendors
for each row execute function public.set_updated_at();

drop trigger if exists product_reviews_set_updated_at on public.product_reviews;
create trigger product_reviews_set_updated_at
before update on public.product_reviews
for each row execute function public.set_updated_at();

drop trigger if exists marketplace_orders_set_updated_at on public.marketplace_orders;
create trigger marketplace_orders_set_updated_at
before update on public.marketplace_orders
for each row execute function public.set_updated_at();

drop trigger if exists taxi_rides_set_updated_at on public.taxi_rides;
create trigger taxi_rides_set_updated_at
before update on public.taxi_rides
for each row execute function public.set_updated_at();

alter table public.businesses enable row level security;
alter table public.reviews enable row level security;
alter table public.menu_items enable row level security;
alter table public.delivery_orders enable row level security;
alter table public.products enable row level security;
alter table public.vendors enable row level security;
alter table public.product_reviews enable row level security;
alter table public.marketplace_orders enable row level security;
alter table public.analytics_events enable row level security;
alter table public.user_consents enable row level security;
alter table public.taxi_rides enable row level security;

drop policy if exists "Businesses are readable by everyone" on public.businesses;
create policy "Businesses are readable by everyone"
on public.businesses for select
using (true);

drop policy if exists "Reviews are readable by everyone" on public.reviews;
create policy "Reviews are readable by everyone"
on public.reviews for select
using (true);

drop policy if exists "Menu items are readable by everyone" on public.menu_items;
create policy "Menu items are readable by everyone"
on public.menu_items for select
using (true);

drop policy if exists "Open delivery orders are readable by drivers" on public.delivery_orders;
create policy "Open delivery orders are readable by drivers"
on public.delivery_orders for select
using (true);

drop policy if exists "Active products are readable by everyone" on public.products;
create policy "Active products are readable by everyone"
on public.products for select
using (status = 'active');

drop policy if exists "Active vendors are readable by everyone" on public.vendors;
create policy "Active vendors are readable by everyone"
on public.vendors for select
using (status in ('active', 'pending'));

drop policy if exists "Anyone can apply as vendor" on public.vendors;
create policy "Anyone can apply as vendor"
on public.vendors for insert
with check (true);

drop policy if exists "Anyone can list products" on public.products;
create policy "Anyone can list products"
on public.products for insert
with check (true);

drop policy if exists "Product reviews are readable by everyone" on public.product_reviews;
create policy "Product reviews are readable by everyone"
on public.product_reviews for select
using (true);

drop policy if exists "Anyone can create product reviews" on public.product_reviews;
create policy "Anyone can create product reviews"
on public.product_reviews for insert
with check (true);

drop policy if exists "Anyone can create marketplace orders" on public.marketplace_orders;
create policy "Anyone can create marketplace orders"
on public.marketplace_orders for insert
with check (true);

drop policy if exists "Anyone can create consented analytics events" on public.analytics_events;
create policy "Anyone can create consented analytics events"
on public.analytics_events for insert
with check (consent_granted = true);

drop policy if exists "Anyone can record consent" on public.user_consents;
create policy "Anyone can record consent"
on public.user_consents for insert
with check (true);

drop policy if exists "Open taxi rides are readable by drivers" on public.taxi_rides;
create policy "Open taxi rides are readable by drivers"
on public.taxi_rides for select
using (true);

drop policy if exists "Anyone can request taxi rides" on public.taxi_rides;
create policy "Anyone can request taxi rides"
on public.taxi_rides for insert
with check (true);

drop policy if exists "Authenticated drivers can update taxi rides" on public.taxi_rides;
create policy "Authenticated drivers can update taxi rides"
on public.taxi_rides for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can create reviews" on public.reviews;
create policy "Authenticated users can create reviews"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Anyone can create delivery orders" on public.delivery_orders;
create policy "Anyone can create delivery orders"
on public.delivery_orders for insert
with check (true);

drop policy if exists "Authenticated drivers can update delivery orders" on public.delivery_orders;
create policy "Authenticated drivers can update delivery orders"
on public.delivery_orders for update
to authenticated
using (true)
with check (true);
