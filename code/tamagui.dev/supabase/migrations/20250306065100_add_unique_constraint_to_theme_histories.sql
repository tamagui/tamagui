alter table "public"."theme_histories" 
add constraint "unique_user_query" unique ("user_id", "search_query");
ADD CONSTRAINT "theme_histories_pkey" PRIMARY KEY ("id");
DROP COLUMN "state"