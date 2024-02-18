IF NOT exists (
  select
    constraint_name
  from
    information_schema.table_constraints
  where
    table_name = 'studio_themes'
    and constraint_type = 'PRIMARY KEY'
) then

alter table
  studio_themes
add
  primary key (id, user_id, uid);
