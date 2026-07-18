begin;

alter table public.orders
  add column if not exists user_id uuid references auth.users(id) on delete set null;

with unique_users as (
  select name, min(id::text)::uuid as id
  from public.users
  group by name
  having count(*) = 1
)
update public.orders as orders
set user_id = unique_users.id
from unique_users
where orders.user_id is null
  and orders."customerName" = unique_users.name;

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

commit;
