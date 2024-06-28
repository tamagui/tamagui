create policy "Enable users to see their own app installations"
on "public"."app_installations"
as permissive
for select
to public
using ((EXISTS ( SELECT 1
   FROM subscription_items
  WHERE (subscription_items.id = app_installations.subscription_item_id))));



