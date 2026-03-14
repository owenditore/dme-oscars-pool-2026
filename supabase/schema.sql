export const SUPABASE_SCHEMA_SQL = `
create extension if not exists pgcrypto;

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  display_order integer not null,
  is_active boolean not null default true
);

create table if not exists nominees (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  label text not null,
  short_label text not null,
  display_order integer not null,
  unique(category_id, label)
);

create table if not exists ballots (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  full_name_normalized text not null unique,
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ballot_picks (
  id uuid primary key default gen_random_uuid(),
  ballot_id uuid not null references ballots(id) on delete cascade,
  category_id uuid not null references categories(id) on delete cascade,
  first_nominee_id uuid not null references nominees(id) on delete cascade,
  second_nominee_id uuid not null references nominees(id) on delete cascade,
  confidence integer not null check (confidence between 0 and 3),
  unique(ballot_id, category_id),
  check (first_nominee_id <> second_nominee_id)
);

create table if not exists results (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null unique references categories(id) on delete cascade,
  winner_nominee_id uuid not null references nominees(id) on delete cascade,
  entered_at timestamptz not null default now()
);
`;
