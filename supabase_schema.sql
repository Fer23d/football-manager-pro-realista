create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  save_data jsonb not null,
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.profiles enable row level security;
alter table public.game_saves enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles_upsert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "game_saves_select_own"
  on public.game_saves for select
  using (auth.uid() = user_id);

create policy "game_saves_insert_own"
  on public.game_saves for insert
  with check (auth.uid() = user_id);

create policy "game_saves_update_own"
  on public.game_saves for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
