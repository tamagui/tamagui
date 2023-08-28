create table public.profiles (
  id uuid not null references auth.users on delete cascade,
  -- Your profile fields go here...
  avatar_url text,
  name text,
  about text,

  primary key (id)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

-- the policy above could be replaced by this if profiles are private:

-- create policy "Profiles are viewable by users who created them."
-- on profiles for select
-- using ( auth.uid() = id );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );


-- inserts a row into public.profiles
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();