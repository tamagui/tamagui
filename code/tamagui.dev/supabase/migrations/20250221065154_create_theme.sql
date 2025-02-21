create table "public"."themes" (
    id uuid not null default uuid_generate_v4() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    name text not null,
    is_dark boolean not null default false,
    query text,
    theme_data jsonb not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, name, is_dark)
);

alter table "public"."themes" enable row level security;