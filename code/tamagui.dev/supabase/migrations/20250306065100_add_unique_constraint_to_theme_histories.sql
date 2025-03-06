alter table "public"."theme_histories" 
add constraint "unique_user_query" unique ("user_id", "search_query");