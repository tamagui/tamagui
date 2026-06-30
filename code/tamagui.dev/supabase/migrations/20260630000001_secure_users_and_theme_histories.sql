-- security incident remediation (2026-06-30)
--
-- 1) public.users: the "Allow users to search other users" policy allowed any
--    authenticated user to SELECT every other user's row, exposing email,
--    billing_address, payment_method, full_name and avatar_url across the whole
--    table. all legitimate cross-user reads run server-side through the service
--    role (supabaseAdmin), which bypasses RLS, so the policy is unnecessary.
drop policy if exists "Allow users to search other users" on public.users;

-- 2) public.theme_histories: row level security was never enabled, and the anon
--    + authenticated roles hold full table grants, so anyone with the public
--    anon key could read, insert, update and delete every row. enable RLS and
--    allow public read only (themes are shared by URL and listed in "recent
--    themes"); all writes go through the service role server-side, so no write
--    policy is required (RLS default-denies direct anon/authenticated writes).
alter table public.theme_histories enable row level security;

drop policy if exists "Public can read shared themes" on public.theme_histories;
create policy "Public can read shared themes"
  on public.theme_histories
  for select
  to public
  using (true);
