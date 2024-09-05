-- Inside the generated migration file, e.g., migrations/20220629123456_add_fields_to_users_private.sql

-- Create policy to allow users to update their own data
create policy "Allow users to update their own row"
on "public"."users_private"
as permissive
for update
to public
using (auth.uid() = id);

-- Enable row level security
alter table "public"."users_private"
enable row level security;
