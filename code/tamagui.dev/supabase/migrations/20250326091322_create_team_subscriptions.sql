create table team_subscriptions (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references auth.users(id) not null,
  total_seats integer not null check (total_seats > 0),
  created_at timestamp with time zone default now() not null,
  expires_at timestamp with time zone not null,

  constraint owner_unique unique (owner_id)
);


create table team_members (
  id uuid primary key default uuid_generate_v4(),
  team_subscription_id uuid references team_subscriptions(id) on delete cascade not null,
  member_id uuid references auth.users(id) not null,
  joined_at timestamp with time zone default now() not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'removed')),
  
  constraint team_member_unique unique (team_subscription_id, member_id)
);

create policy "Allow users to search other users"
  on users
  for select
  using (
    -- Allow all users to search other users
    auth.uid() != id
  );