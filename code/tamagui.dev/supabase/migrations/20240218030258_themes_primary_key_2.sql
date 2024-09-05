
alter table studio_themes drop constraint if exists studio_themes_pkey;


alter table
  studio_themes
add
  primary key (id, user_id, uid);
