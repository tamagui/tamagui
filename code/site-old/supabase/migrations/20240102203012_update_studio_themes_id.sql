create sequence studio_themes_seq start with 100;
alter table "public"."studio_themes" alter column id set default nextval('studio_themes_seq');
-- ALTER TABLE "public"."studio_themes" ALTER COLUMN id DROP NOT NULL;
