-- security incident remediation, part 4 (2026-06-30)
--
-- fix infinite recursion between the projects and project_team_members RLS
-- policies. the projects "Team members can view ..." SELECT policy ran
-- EXISTS(... from project_team_members ...), and the project_team_members
-- "Project owners can manage ..." ALL policy ran EXISTS(... from projects ...),
-- so evaluating either table's policy triggered the other's, looping forever --
-- a plain authenticated SELECT on public.projects errored with
-- "infinite recursion detected in policy for relation projects".
--
-- the app reads both tables via the service role (bypasses RLS), so this was
-- latent (fails closed), but the RLS was non-functional. move the cross-table
-- checks into SECURITY DEFINER helpers -- which run as the function owner and so
-- bypass RLS on the table they read, breaking the cycle -- with a pinned
-- search_path so they can't be hijacked by a shadowing object.

create or replace function public.is_project_owner(p_project_id uuid, p_user_id uuid)
  returns boolean
  language sql
  security definer
  set search_path = ''
  stable
as $$
  select exists (
    select 1 from public.projects
    where id = p_project_id and user_id = p_user_id
  );
$$;

create or replace function public.is_project_member(p_project_id uuid, p_user_id uuid)
  returns boolean
  language sql
  security definer
  set search_path = ''
  stable
as $$
  select exists (
    select 1 from public.project_team_members
    where project_id = p_project_id and user_id = p_user_id
  );
$$;

-- projects: a team member can view projects they belong to (the membership
-- lookup now goes through is_project_member, which reads project_team_members
-- without re-triggering its RLS)
drop policy if exists "Team members can view projects they belong to" on public.projects;
create policy "Team members can view projects they belong to"
  on public.projects
  for select
  to public
  using (public.is_project_member(id, (select auth.uid())));

-- project_team_members: a project owner can manage its members (the ownership
-- lookup now goes through is_project_owner, which reads projects without
-- re-triggering its RLS)
drop policy if exists "Project owners can manage team members" on public.project_team_members;
create policy "Project owners can manage team members"
  on public.project_team_members
  for all
  to public
  using (public.is_project_owner(project_id, (select auth.uid())))
  with check (public.is_project_owner(project_id, (select auth.uid())));
