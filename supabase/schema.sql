-- Enable PostGIS extension for spatial queries (Map/Nearby Hotels)
create extension if not exists postgis schema extensions;

-- 1. PROFILES (Extends Supabase Auth Auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  avatar text,
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Handle profile creation on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. HOTELS
create table hotels (
  id text primary key,
  name text not null,
  city text not null,
  address text,
  description text,
  price numeric not null,
  rating numeric(3,2) default 0,
  review_count integer default 0,
  images text[] default '{}',
  amenities text[] default '{}',
  category text,
  is_featured boolean default false,
  lat double precision,
  lng double precision,
  -- PostGIS Geography Point (Longitude, Latitude)
  location geography(point) generated always as (
    st_point(lng, lat)::geography
  ) stored,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Index for spatial queries
create index hotels_geo_index on hotels using gist (location);


-- 3. ROOMS
create table rooms (
  id text primary key,
  hotel_id text references hotels(id) on delete cascade not null,
  type text not null,
  price numeric not null,
  capacity integer not null default 2,
  bed_type text,
  features text[] default '{}',
  images text[] default '{}',
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 4. BOOKINGS
create table bookings (
  id uuid default extensions.uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  hotel_id text references hotels(id) not null,
  room_id text references rooms(id) not null,
  hotel_name text not null,
  hotel_image text,
  room_type text not null,
  check_in date not null,
  check_out date not null,
  nights integer not null,
  guests jsonb not null,
  guest_name text,
  guest_phone text,
  special_requests text,
  promo_code text,
  price_breakdown jsonb not null,
  total_price numeric not null,
  payment_method text,
  transaction_id text,
  status text check (status in ('pending', 'confirmed', 'completed', 'cancelled')) default 'confirmed',
  booking_ref text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 5. REVIEWS
create table reviews (
  id uuid default extensions.uuid_generate_v4() primary key,
  hotel_id text references hotels(id) on delete cascade not null,
  user_id uuid references auth.users,
  user_name text not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  text text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);


-- 6. WISHLISTS
create table wishlists (
  user_id uuid references auth.users on delete cascade not null,
  hotel_id text references hotels(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, hotel_id)
);


-- ==========================================
-- RPC FUNCTIONS (Stored Procedures)
-- ==========================================

-- RPC: Check Room Availability
-- Checks if a specific room in a specific hotel has available inventory for the given dates
create or replace function check_availability(
  p_hotel_id text,
  p_room_id text,
  p_check_in date,
  p_check_out date
) returns boolean as $$
declare
  v_total_rooms integer;
  v_booked_rooms integer;
begin
  -- Get total inventory for this room type
  select quantity into v_total_rooms
  from rooms
  where id = p_room_id and hotel_id = p_hotel_id;

  if v_total_rooms is null then
    return false; -- Room doesn't exist
  end if;

  -- Count overlapping confirmed/completed bookings
  -- Overlap condition: (StartDate1 < EndDate2) and (EndDate1 > StartDate2)
  select count(*) into v_booked_rooms
  from bookings
  where hotel_id = p_hotel_id 
    and room_id = p_room_id
    and status in ('confirmed', 'completed')
    and check_in < p_check_out 
    and check_out > p_check_in;

  -- Return true if we have more physical rooms than booked overlapping rooms
  return v_booked_rooms < v_total_rooms;
end;
$$ language plpgsql;


-- RPC: Filter nearby hotels (using PostGIS)
create or replace function get_nearby_hotels(
  p_lat double precision,
  p_lng double precision,
  p_radius_meters double precision
) returns setof hotels as $$
begin
  return query
  select *
  from hotels
  where st_dwithin(
    location,
    st_point(p_lng, p_lat)::geography,
    p_radius_meters
  )
  order by location <-> st_point(p_lng, p_lat)::geography;
end;
$$ language plpgsql;


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================
-- (For a production app, you would enable RLS and add policies here.
-- For this MVP timeline, we will leave tables public to ensure the client connects smoothly,
-- but the architecture fully supports strict RLS.)

-- Example:
-- alter table profiles enable row level security;
-- create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
