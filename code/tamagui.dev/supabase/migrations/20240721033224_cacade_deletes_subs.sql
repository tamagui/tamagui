-- Drop the existing foreign key constraint
ALTER TABLE "public"."app_installations" DROP CONSTRAINT IF EXISTS "app_installations_subscription_item_id_fkey";

-- Add the new foreign key constraint with ON DELETE CASCADE
ALTER TABLE "public"."app_installations" ADD CONSTRAINT "app_installations_subscription_item_id_fkey" 
    FOREIGN KEY (subscription_item_id) 
    REFERENCES subscription_items(id) 
    ON DELETE CASCADE 
    NOT VALID;

-- Validate the constraint
ALTER TABLE "public"."app_installations" VALIDATE CONSTRAINT "app_installations_subscription_item_id_fkey";
