-- ─────────────────────────────────────────────────────────────────────────────
-- profiles table
-- Extends auth.users with application-level user data.
--
-- Extensibility notes:
--   • Add new columns via ALTER TABLE — no destructive changes needed.
--   • `metadata` JSONB is a catch-all for soft fields that don't yet warrant
--     a dedicated column (e.g. notification prefs, feature flags, misc config).
-- ─────────────────────────────────────────────────────────────────────────────

create table public.profiles (
  -- Identity — mirrors auth.users.id 1:1
  id                    uuid        primary key references auth.users (id) on delete cascade,

  -- Public identity
  username              text        unique,
  display_name          text,
  bio                   text,
  avatar_url            text,

  -- Trading context
  asset_focus           text        check (asset_focus in ('STOCKS','CRYPTO','OPTIONS','FUTURES','MIXED')),

  -- Social counters (denormalized for fast reads; kept in sync by triggers)
  followers_count       integer     not null default 0,
  following_count       integer     not null default 0,

  -- Trust / verification
  is_verified           boolean     not null default false,

  -- Onboarding gate — false until user completes the post-signup flow
  onboarding_completed  boolean     not null default false,

  -- Extensibility hook — store ad-hoc fields here before they earn a column
  metadata              jsonb       not null default '{}',

  -- Timestamps
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────────────────────────────────────
create index profiles_username_idx    on public.profiles (username);
create index profiles_created_at_idx  on public.profiles (created_at desc);

-- ── Row Level Security ────────────────────────────────────────────────────────
alter table public.profiles enable row level security;

-- Anyone can read any profile (public feed, leaderboard, etc.)
create policy "profiles: public read"
  on public.profiles for select
  using (true);

-- Users can only insert their own row
create policy "profiles: self insert"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can only update their own row
create policy "profiles: self update"
  on public.profiles for update
  using (auth.uid() = id);

-- ── Auto-create profile on first sign-up ─────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Keep updated_at current ───────────────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
