# Supabase migrations

## RLS is mandatory on every `public` table

Every table in the `public` schema is exposed through PostgREST to the `anon`
and `authenticated` roles via default grants. **Disabling RLS does not hide a
table** - it makes it fully readable/writable by anyone holding the public anon
key (which ships in the client bundle), no matter how the app's own code reads
it.

"This table is only accessed via the service role, so it doesn't need RLS" is
**wrong** and has caused a real privilege-escalation incident (anon inserting
themselves into `pro_whitelist`). The service role bypassing RLS protects the
app's code path; it does nothing about direct REST calls.

So, for any new table:

- `alter table public.<t> enable row level security;` - always.
- Access is service-role-only (`supabaseAdmin`)? Enable RLS and add **no
  policies** - the service role still works (it bypasses RLS), and anon /
  authenticated get default-denied.
- Needs user-scoped access? Add the narrowest policy that fits (`auth.uid() =
  <owner col>`), scoped to the right `cmd` (don't grant `for all` when you mean
  `for select`).
- Intentionally public read (e.g. shared/catalog data)? `for select to public
  using (true)` only - never a blanket write policy.
- Never write a policy `to public with check (true)` for inserts; that lets anon
  write. If only the server inserts, rely on the service role and add no insert
  policy.

After adding a migration, verify the live state actually matches intent:

```sql
select c.relname, c.relrowsecurity as rls
from pg_class c join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r' and c.relrowsecurity = false;
-- ^ should return zero rows
```
