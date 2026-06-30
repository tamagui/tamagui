-- security incident remediation (2026-06-30)
--
-- root cause: several tables were created without enabling row level security
-- (or with an over-broad policy), on the mistaken assumption that "only the app
-- accesses them via the service role" is sufficient. it is not: every table in
-- the public schema is exposed through PostgREST to the anon + authenticated
-- roles via default grants, so with RLS disabled anyone holding the public anon
-- key can read/insert/update/delete those rows directly over the REST API.
-- all legitimate app access to these tables already runs server-side through
-- the service role (supabaseAdmin), which bypasses RLS, so enabling RLS with no
-- (or read-only) policies closes the holes without changing app behavior.

-- 1) public.users: drop the policy that let any authenticated user SELECT every
--    other user's row, exposing email, billing_address, payment_method,
--    full_name and avatar_url. cross-user reads run through the service role.
drop policy if exists "Allow users to search other users" on public.users;

-- 2) public.theme_histories: RLS was never enabled -> anon had full CRUD on all
--    rows. enable RLS and allow public read only (themes are shared by URL and
--    listed in "recent themes"); all writes go through the service role.
alter table public.theme_histories enable row level security;
drop policy if exists "Public can read shared themes" on public.theme_histories;
create policy "Public can read shared themes"
  on public.theme_histories
  for select
  to public
  using (true);

-- 3) public.pro_whitelist: RLS was never enabled -> anon could INSERT their own
--    github_username to grant themselves pro/Bento access (privilege
--    escalation), or read/modify the list. only the service role touches it.
alter table public.pro_whitelist enable row level security;

-- 4) public.team_subscriptions + public.team_members: RLS was never enabled ->
--    anon could read and modify every team's seats and membership. only the
--    service role touches them.
alter table public.team_subscriptions enable row level security;
alter table public.team_members enable row level security;

-- 5) public.project_domain_history: the "Service role can insert domain history"
--    policy has no role restriction (defaults to public) with_check (true), so
--    anon/authenticated could insert arbitrary rows. inserts run through the
--    service role (which bypasses RLS), so the policy is redundant - drop it.
drop policy if exists "Service role can insert domain history" on public.project_domain_history;
