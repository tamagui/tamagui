alter table "public"."teams" add column "owner_id" uuid;

alter table "public"."teams" add constraint "teams_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."teams" validate constraint "teams_owner_id_fkey";


