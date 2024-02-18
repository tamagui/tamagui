
alter table
  studio_themes add primary key (id, user_id, uid) IF NOT EXISTS;
