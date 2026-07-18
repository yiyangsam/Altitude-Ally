-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Products Table
create table public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  unit text not null,
  category text not null,
  description text,
  details text,
  variations jsonb not null default '[]'::jsonb,
  portions jsonb not null default '[]'::jsonb,
  availability text not null default 'visible' check (availability in ('visible', 'out_of_stock', 'hidden')),
  image text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Existing projects can run these safely to add product detail options.
alter table public.products add column if not exists details text;
alter table public.products add column if not exists variations jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists portions jsonb not null default '[]'::jsonb;
alter table public.products add column if not exists availability text not null default 'visible';

-- Orders Table
create table public.orders (
  id uuid default uuid_generate_v4() primary key,
  "customerName" text not null,
  date text not null,
  total numeric not null,
  items jsonb not null default '[]'::jsonb,
  status text not null default 'Pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Users Table
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  email text not null,
  phone text,
  address text,
  role text not null default 'Customer',
  "joinedDate" text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories Table
create table public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Initial Categories
insert into public.categories (name) values
  ('Leafy Greens'),
  ('Root Vegetables'),
  ('Herbs'),
  ('Seasonal Fruit'),
  ('Grains');

-- Impact Projects Table
create table public.impact_projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  tag text not null,
  amount text not null,
  status text not null,
  image text not null,
  details text not null default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.impact_projects add column if not exists details text not null default '';

-- Admin Config Table
create table public.admin_config (
  id integer primary key default 1,
  username text not null,
  password text not null
);

-- Seed initial admin
insert into public.admin_config (id, username, password) values (1, 'altitude_admin', 'altitude_admin_password');

-- Payment Config Table
create table public.payment_config (
  id integer primary key default 1,
  qr_image text not null,
  bank_info text not null
);

-- Seed initial payment config
insert into public.payment_config (id, qr_image, bank_info) values (1, 'https://images.unsplash.com/photo-1607523171350-f8fa7ae058d9?auto=format&fit=crop&q=80&w=400', 'KBANK - 123-4-56789-0 (Altitude Collectives)');

-- Impact Page Config Table
create table public.impact_page_config (
  id integer primary key default 1,
  hero_title text,
  hero_description text,
  families_served text,
  transparency_stats jsonb
);

-- Seed initial impact page config
insert into public.impact_page_config (id, hero_title, hero_description, families_served, transparency_stats) values (
  1, 
  '$5,000 Raised for School Gardens', 
  'Together, we''ve cultivated more than just produce. We''ve planted the seeds of nutrition and community for 800+ families.', 
  '800+', 
  '[{"label":"Garden Infrastructure","value":65,"color":"bg-primary"},{"label":"Seed Distribution","value":25,"color":"bg-primary-fixed-dim"},{"label":"Community Workshops","value":10,"color":"bg-tertiary-fixed-dim"}]'::jsonb
);

-- Donation Page Config Table
create table public.donation_page_config (
  id integer primary key default 1,
  title text not null,
  subtitle text not null,
  bottom_title text not null,
  tzuchi_link_text text not null,
  tzuchi_link_url text not null,
  qr_image text not null,
  qr_caption text not null
);

insert into public.donation_page_config (
  id,
  title,
  subtitle,
  bottom_title,
  tzuchi_link_text,
  tzuchi_link_url,
  qr_image,
  qr_caption
) values (
  1,
  'Placeholder',
  'Placeholder',
  'Placeholder',
  'Placeholder',
  'https://www.tzuchi.org.tw/en/',
  '',
  'Placeholder'
);

-- Market Page Config Table
create table public.market_page_config (
  id integer primary key default 1,
  hero_image_url text not null
);

-- Seed initial market page config
insert into public.market_page_config (id, hero_image_url) values (
  1,
  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000'
);

-- Footer Page Config Table
create table public.footer_page_config (
  id integer primary key default 1,
  mission_text text not null,
  privacy_text text not null,
  terms_text text not null,
  instagram text not null,
  email text not null,
  line text not null,
  facebook text not null
);

insert into public.footer_page_config (
  id,
  mission_text,
  privacy_text,
  terms_text,
  instagram,
  email,
  line,
  facebook
) values (
  1,
  'Our mission content will be added here.',
  'Our privacy policy will be added here.',
  'Our terms and conditions will be added here.',
  'Instagram details coming soon.',
  'Email details coming soon.',
  'LINE details coming soon.',
  'Facebook details coming soon.'
);
