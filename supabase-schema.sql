-- Paste this whole file into Supabase → SQL Editor → Run.
-- Creates the starter tables for Projects, Tasks, Comments, Approvals, Members, Teams.

create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text,
  poc text,
  brand_poc text,
  assignees text[],
  initiation_date date,
  go_live_date date,
  effort numeric default 0,
  progress int default 0,
  health text default 'awaiting',
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  status text default 'todo',
  priority text default 'Medium',
  due_date date,
  assignee_id text,
  assigned_by_id text,
  team_id text,
  created_at timestamptz default now()
);

create table comments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  author text,
  body text not null,
  visible_to_client boolean default false,
  created_at timestamptz default now()
);

create table approvals (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  title text not null,
  version int default 1,
  status text default 'Pending',
  requested_at timestamptz default now()
);

create table members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  position text,
  phone text,
  created_at timestamptz default now()
);

create table teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status text default 'Active'
);

create table team_members (
  team_id uuid references teams(id) on delete cascade,
  member_id uuid references members(id) on delete cascade,
  primary key (team_id, member_id)
);
