-- uses subscription_item_id instead of user_id to be more explicit and to make things easier on the side of takeout bot

alter table "public"."app_installations" drop constraint "app_installations_user_id_fkey";

alter table "public"."app_installations" drop column "user_id";

alter table "public"."app_installations" add column "subscription_item_id" text not null;

alter table "public"."app_installations" add constraint "app_installations_subscription_item_id_fkey" FOREIGN KEY (subscription_item_id) REFERENCES subscription_items(id) not valid;

alter table "public"."app_installations" validate constraint "app_installations_subscription_item_id_fkey";

