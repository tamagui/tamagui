create type climb_type as enum('top_rope', 'lead_rope', 'boulder');


-- Adding new columns
ALTER TABLE public.profiles
  ADD COLUMN username text UNIQUE,
  ADD COLUMN climb_type climb_type[] DEFAULT ARRAY['boulder'::climb_type],
  ADD COLUMN bio text,
  ADD COLUMN first_name text not null,
  ADD COLUMN last_name text not null;

-- Dropping existing columns
ALTER TABLE public.profiles
  DROP COLUMN name,
  DROP COLUMN about;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_climb_type climb_type[] := ARRAY['boulder'::climb_type]; -- Initialize to default value
BEGIN

  RAISE NOTICE 'raw_user_meta_data: %', new.raw_user_meta_data;

  -- Set climb_type if available in raw_user_meta_data
  BEGIN
    SELECT INTO v_climb_type ARRAY(
      SELECT json_array_elements_text(new.raw_user_meta_data -> 'climb_type')
    )::climb_type[]
    WHERE new.raw_user_meta_data -> 'climb_type' IS NOT NULL;
  EXCEPTION
    WHEN OTHERS THEN
      RAISE NOTICE 'Failed to set climb_type. Using default value.';
  END;

  -- Insert into public.profiles
  BEGIN
    INSERT INTO public.profiles (id, first_name, last_name, username, avatar_url, bio, climb_type)
    VALUES (
      new.id,
      new.raw_user_meta_data ->> 'first_name',
      new.raw_user_meta_data ->> 'last_name',
      new.raw_user_meta_data ->> 'username',
      new.raw_user_meta_data ->> 'avatar_url',
      new.raw_user_meta_data ->> 'bio',
      v_climb_type
    );
  EXCEPTION
    WHEN OTHERS THEN
      RAISE EXCEPTION 'Failed to insert into public.profiles: %', SQLERRM;
  END;

  RETURN new;
END;
$$;


-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER
-- LANGUAGE plpgsql
-- SECURITY DEFINER
-- SET search_path = public
-- AS $$
-- DECLARE
--   v_climb_type climb_type[];  -- Declare the variable here
-- BEGIN

--   RAISE NOTICE 'raw_user_meta_data: %', new.raw_user_meta_data;

--   -- Set climb_type if available in raw_user_meta_data, else let it be NULL (default will be used)
--   SELECT INTO v_climb_type ARRAY(
--     SELECT json_array_elements_text(new.raw_user_meta_data -> 'climb_type')
--   )::climb_type[]

--   WHERE new.raw_user_meta_data -> 'climb_type' IS NOT NULL;
--   INSERT INTO public.profiles (id, first_name, last_name, username, avatar_url, bio, climb_type)
--   VALUES (
--     new.id,
--     new.raw_user_meta_data ->> 'first_name',
--     new.raw_user_meta_data ->> 'last_name',
--     new.raw_user_meta_data ->> 'username',
--     new.raw_user_meta_data ->> 'avatar_url',
--     new.raw_user_meta_data ->> 'bio',
--     -- Figure out how to actually do this
--     v_climb_type -- will be NULL if not set, so default value will be used
--   );

--   RETURN new;
-- END;
-- $$;
