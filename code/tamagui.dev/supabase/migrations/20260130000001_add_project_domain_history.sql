-- Domain history table to track domain changes for projects
create table if not exists project_domain_history (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  domain text not null,
  changed_at timestamptz default now() not null,
  changed_by uuid references auth.users(id) on delete set null
);

-- Index for looking up history by project
create index if not exists project_domain_history_project_id_idx on project_domain_history(project_id);

-- RLS policies
alter table project_domain_history enable row level security;

-- Project owners can view domain history
create policy "Project owners can view domain history"
  on project_domain_history for select
  using (
    exists (
      select 1 from projects
      where projects.id = project_domain_history.project_id
      and projects.user_id = auth.uid()
    )
  );

-- Only allow insert via service role (from API)
create policy "Service role can insert domain history"
  on project_domain_history for insert
  with check (true);
