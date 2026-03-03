create table if not exists public.poop_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bristol_type int not null check (bristol_type between 1 and 7),
  color text not null,
  color_status text not null,
  fragmentation text not null,
  edge_fuzziness text not null,
  volume text not null,
  gut_score int not null check (gut_score between 0 and 100),
  health_insight text not null,
  humor_comment text not null,
  warning boolean not null default false,
  warning_detail text,
  created_at timestamptz not null default now()
);

alter table public.poop_logs enable row level security;

create policy "Users can select own poop logs"
  on public.poop_logs
  for select
  using (auth.uid() = user_id);

create policy "Users can insert own poop logs"
  on public.poop_logs
  for insert
  with check (auth.uid() = user_id);
