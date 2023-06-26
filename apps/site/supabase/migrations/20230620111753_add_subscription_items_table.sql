alter table "public"."subscriptions" drop constraint "subscriptions_price_id_fkey";

create table "public"."subscription_items" (
    "subscription_id" text not null,
    "price_id" text not null,
    "id" text not null
);


alter table "public"."subscription_items" enable row level security;

alter table "public"."subscriptions" drop column "price_id";

CREATE UNIQUE INDEX subscription_items_pkey ON public.subscription_items USING btree (id);

alter table "public"."subscription_items" add constraint "subscription_items_pkey" PRIMARY KEY using index "subscription_items_pkey";

alter table "public"."subscription_items" add constraint "subscription_items_price_id_fkey" FOREIGN KEY (price_id) REFERENCES prices(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_items" validate constraint "subscription_items_price_id_fkey";

alter table "public"."subscription_items" add constraint "subscription_items_subscription_id_fkey" FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_items" validate constraint "subscription_items_subscription_id_fkey";

create policy "Enable select for users who own the subscription"
on "public"."subscription_items"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM subscriptions
  WHERE (subscriptions.id = subscription_items.subscription_id))));



