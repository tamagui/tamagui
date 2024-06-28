create table "public"."studio_themes" (
    "id" bigint not null,
    "created_at" timestamp with time zone default now(),
    "user_id" uuid not null,
    "team_id" bigint not null,
    "data" jsonb
);


alter table "public"."studio_themes" enable row level security;

CREATE UNIQUE INDEX studio_themes_pkey ON public.studio_themes USING btree (id, user_id, team_id);

alter table "public"."studio_themes" add constraint "studio_themes_pkey" PRIMARY KEY using index "studio_themes_pkey";

alter table "public"."studio_themes" add constraint "studio_themes_team_id_fkey" FOREIGN KEY (team_id) REFERENCES teams(id) not valid;

alter table "public"."studio_themes" validate constraint "studio_themes_team_id_fkey";

alter table "public"."studio_themes" add constraint "studio_themes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."studio_themes" validate constraint "studio_themes_user_id_fkey";

create policy "Enable users with the same user_id to perform operations on row"
on "public"."studio_themes"
as permissive
for all
to public
using (((auth.uid() IN ( SELECT memberships.user_id
   FROM memberships
  WHERE (memberships.team_id = studio_themes.team_id))) AND (auth.uid() = user_id)))
with check (((auth.uid() IN ( SELECT memberships.user_id
   FROM memberships
  WHERE (memberships.team_id = studio_themes.team_id))) AND (auth.uid() = user_id)));



