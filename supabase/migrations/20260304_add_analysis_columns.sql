-- Add analysis columns that were missing from initial table creation
alter table public.poop_logs
  add column if not exists bristol_type int check (bristol_type between 1 and 7),
  add column if not exists color text,
  add column if not exists color_status text,
  add column if not exists fragmentation text,
  add column if not exists edge_fuzziness text,
  add column if not exists volume text,
  add column if not exists gut_score int check (gut_score between 0 and 100),
  add column if not exists health_insight text,
  add column if not exists humor_comment text,
  add column if not exists warning boolean default false,
  add column if not exists warning_detail text;
