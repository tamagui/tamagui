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
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, username, avatar_url)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.raw_user_meta_data ->> 'username',
    new.raw_user_meta_data ->> 'avatar_url',
    new.raw_user_meta_data ->> 'bio',
    ARRAY(SELECT json_array_elements_text(new.raw_user_meta_data -> 'climb_type'))::climb_type[]
  );

  RETURN new;
END;
$$;
