alter table "public"."claims" add column "product_ownership_id" bigint;

alter table "public"."claims" alter column "subscription_id" drop not null;

alter table "public"."claims" add constraint "claims_product_ownership_id_fkey" FOREIGN KEY (product_ownership_id) REFERENCES product_ownership(id) not valid;

alter table "public"."claims" validate constraint "claims_product_ownership_id_fkey";


