begin;

alter table public.products
  add column if not exists details text,
  add column if not exists variations jsonb not null default '[]'::jsonb,
  add column if not exists portions jsonb not null default '[]'::jsonb;

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
