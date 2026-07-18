begin;

alter table public.products
  add column if not exists details text,
  add column if not exists variations jsonb not null default '[]'::jsonb,
  add column if not exists portions jsonb not null default '[]'::jsonb,
  add column if not exists availability text not null default 'visible';

alter table public.impact_projects
  add column if not exists details text not null default '';

create table if not exists public.donation_projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  date date not null,
  image text not null,
  description text not null default '',
  amount text not null default '',
  amount_enabled boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists public.donation_page_config (
  id integer primary key,
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
)
on conflict (id) do nothing;

create table if not exists public.market_page_config (
  id integer primary key,
  hero_image_url text not null
);

insert into public.market_page_config (id, hero_image_url)
values (
  1,
  'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=2000'
)
on conflict (id) do nothing;

create table if not exists public.footer_page_config (
  id integer primary key,
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
)
on conflict (id) do nothing;

commit;
