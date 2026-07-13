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

commit;
