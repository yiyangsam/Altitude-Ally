begin;

alter table public.market_page_config
  add column if not exists hero_images jsonb not null default '[]'::jsonb,
  add column if not exists hero_interval_seconds integer not null default 5;

update public.market_page_config
set hero_images = jsonb_build_array(hero_image_url)
where jsonb_array_length(hero_images) = 0;

commit;
