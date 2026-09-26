create extension if not exists pgcrypto;

create table if not exists public.work_items (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  customer_name text not null,
  country text,
  stage text not null default '詢價',
  priority text not null default 'P2' check (priority in ('P0', 'P1', 'P2')),
  status text not null default 'open',
  summary text not null default '',
  last_contact date,
  next_contact date,
  recommendation jsonb not null default '{}'::jsonb,
  decision text check (decision is null or decision in ('adopt', 'modify', 'defer', 'reject')),
  decision_note text,
  action jsonb,
  outcome jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_events (
  id uuid primary key default gen_random_uuid(),
  work_item_id uuid not null references public.work_items(id) on delete cascade,
  owner_id uuid not null references auth.users(id) on delete cascade,
  event_type text not null,
  note text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists work_items_owner_updated_idx on public.work_items(owner_id, updated_at desc);
create index if not exists work_events_item_created_idx on public.work_events(work_item_id, created_at desc);

alter table public.work_items enable row level security;
alter table public.work_events enable row level security;

drop policy if exists "owners_manage_work_items" on public.work_items;
create policy "owners_manage_work_items"
on public.work_items for all
using (auth.uid() = owner_id)
with check (auth.uid() = owner_id);

drop policy if exists "owners_manage_work_events" on public.work_events;
create policy "owners_manage_work_events"
on public.work_events for all
using (auth.uid() = owner_id)
with check (
  auth.uid() = owner_id
  and exists (
    select 1 from public.work_items item
    where item.id = work_item_id and item.owner_id = auth.uid()
  )
);

grant select, insert, update, delete on public.work_items to authenticated;
grant select, insert, update, delete on public.work_events to authenticated;
