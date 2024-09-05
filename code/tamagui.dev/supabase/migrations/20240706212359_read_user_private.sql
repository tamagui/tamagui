create policy "Allow users to read their own row"
on "public"."users_private"
as permissive
for select
to public
using (auth.uid() = id);
