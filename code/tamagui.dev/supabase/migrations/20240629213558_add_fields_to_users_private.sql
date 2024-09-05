-- Inside the generated migration file, e.g., migrations/20220629123456_add_fields_to_users_private.sql

-- Add fields to the users_private table
ALTER TABLE users_private
ADD COLUMN github_refresh_token TEXT,
ADD COLUMN email TEXT,
ADD COLUMN full_name TEXT,
ADD COLUMN github_user_name TEXT;
