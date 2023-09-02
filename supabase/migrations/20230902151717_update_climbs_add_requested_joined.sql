alter table public.climbs
  -- the climb needs a min of 2 climbers
  add column requested smallint default 2 not null,
  -- The climber that has created the climb has auto joined the climb
  add column joined smallint default 1 not null;
