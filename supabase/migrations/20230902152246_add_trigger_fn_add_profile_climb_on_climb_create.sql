create function public.handle_new_climb()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    INSERT INTO public.profile_climbs (profile_id, climb_id)
    VALUES (
      new.created_by,
      new.id
    );
    return new;
  end;
$$;

create trigger on_climb_created
  after insert on public.climbs
  for each row execute procedure public.handle_new_climb();
