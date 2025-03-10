alter table "public"."theme_histories" 
add column "og_image_url" text,
add column "is_cached" boolean default false;