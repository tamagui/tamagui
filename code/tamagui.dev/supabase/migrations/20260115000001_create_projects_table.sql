-- Projects table for v2 per-project licensing
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null check (char_length(name) > 2),
  domain text not null check (char_length(domain) > 2),
  created_at timestamptz default now() not null,
  license_purchased_at timestamptz default now() not null,
  updates_expire_at timestamptz not null, -- 1 year from purchase, extended by upgrade subscription
  upgrade_subscription_id text references subscriptions(id) on delete set null,
  constraint unique_project_domain unique (domain)
);

-- Project team members (unlimited, no extra cost in v2)
create table if not exists project_team_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'member' not null check (role in ('owner', 'member')),
  invited_at timestamptz default now() not null,
  constraint unique_project_member unique (project_id, user_id)
);

-- Indexes
create index if not exists projects_user_id_idx on projects(user_id);
create index if not exists projects_domain_idx on projects(domain);
create index if not exists project_team_members_project_id_idx on project_team_members(project_id);
create index if not exists project_team_members_user_id_idx on project_team_members(user_id);

-- RLS policies for projects
alter table projects enable row level security;

create policy "Users can view their own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert their own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on projects for update
  using (auth.uid() = user_id);

-- RLS policies for project_team_members
alter table project_team_members enable row level security;

create policy "Project owners can manage team members"
  on project_team_members for all
  using (
    exists (
      select 1 from projects
      where projects.id = project_team_members.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "Team members can view their membership"
  on project_team_members for select
  using (auth.uid() = user_id);

-- Allow team members to view projects they're part of
create policy "Team members can view projects they belong to"
  on projects for select
  using (
    exists (
      select 1 from project_team_members
      where project_team_members.project_id = projects.id
      and project_team_members.user_id = auth.uid()
    )
  );
