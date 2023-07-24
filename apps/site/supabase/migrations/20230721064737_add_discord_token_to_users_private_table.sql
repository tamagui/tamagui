alter table "public"."users_private" add column "discord_token" text;

alter table "public"."users_private" alter column "github_token" drop not null;

create policy "Let users view their own row"
on "public"."users_private"
as permissive
for select
to public
using ((auth.uid() = id));



