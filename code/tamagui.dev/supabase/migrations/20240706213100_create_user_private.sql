-- Create policy to allow users to insert their own data
create policy "Allow users to insert their own row"
on "public"."users_private"
as permissive
for insert
to public
with check (auth.uid() = id);
