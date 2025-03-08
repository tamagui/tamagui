revoke delete on table "public"."theme_histories" from "anon";

revoke insert on table "public"."theme_histories" from "anon";

revoke references on table "public"."theme_histories" from "anon";

revoke select on table "public"."theme_histories" from "anon";

revoke trigger on table "public"."theme_histories" from "anon";

revoke truncate on table "public"."theme_histories" from "anon";

revoke update on table "public"."theme_histories" from "anon";

revoke delete on table "public"."theme_histories" from "authenticated";

revoke insert on table "public"."theme_histories" from "authenticated";

revoke references on table "public"."theme_histories" from "authenticated";

revoke select on table "public"."theme_histories" from "authenticated";

revoke trigger on table "public"."theme_histories" from "authenticated";

revoke truncate on table "public"."theme_histories" from "authenticated";

revoke update on table "public"."theme_histories" from "authenticated";

revoke delete on table "public"."theme_histories" from "service_role";

revoke insert on table "public"."theme_histories" from "service_role";

revoke references on table "public"."theme_histories" from "service_role";

revoke select on table "public"."theme_histories" from "service_role";

revoke trigger on table "public"."theme_histories" from "service_role";

revoke truncate on table "public"."theme_histories" from "service_role";

revoke update on table "public"."theme_histories" from "service_role";

alter table "public"."theme_histories" drop constraint "theme_histories_user_id_fkey";

alter table "public"."theme_histories" drop constraint "theme_histories_user_id_search_query_key";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."users_private" drop constraint "users_private_pkey";

drop index if exists "public"."idx_theme_histories_created_at";

drop index if exists "public"."idx_theme_histories_user_id";

drop index if exists "public"."theme_histories_user_id_search_query_key";

drop index if exists "public"."users_private_pkey";

drop table "public"."theme_histories";

CREATE UNIQUE INDEX github_tokens_pkey ON public.users_private USING btree (id);

alter table "public"."users_private" add constraint "github_tokens_pkey" PRIMARY KEY using index "github_tokens_pkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_user_product_info(github_id_input text)
 RETURNS TABLE(product_name text)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    products.name as product_name
  from
    teams
    join users on teams.owner_id = users.id
    join product_ownership on users.id = product_ownership.user_id
    join prices on product_ownership.price_id = prices.id
    join products on products.id = prices.product_id
  where
    teams.github_id = github_id_input
    and products.name = 'Bento';
end;
$function$
;

CREATE OR REPLACE FUNCTION public.has_bento_access(github_id_input text)
 RETURNS TABLE(product_name text)
 LANGUAGE plpgsql
AS $function$
begin
  return query
  select
    products.name as product_name
  from
    teams
    join users on teams.owner_id = users.id
    join product_ownership on users.id = product_ownership.user_id
    join prices on product_ownership.price_id = prices.id
    join products on products.id = prices.product_id
  where
    teams.github_id = github_id_input
    and products.name = 'Bento';
end;
$function$
;

CREATE OR REPLACE FUNCTION public.hello_world()
 RETURNS text
 LANGUAGE sql
AS $function$  -- 4
  select 'hello world';  -- 5
$function$
;


