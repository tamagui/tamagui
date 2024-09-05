import { sql } from 'drizzle-orm'
import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum('code_challenge_method', ['s256', 'plain'])
export const factor_status = pgEnum('factor_status', ['unverified', 'verified'])
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn'])
export const one_time_token_type = pgEnum('one_time_token_type', [
  'confirmation_token',
  'reauthentication_token',
  'recovery_token',
  'email_change_token_new',
  'email_change_token_current',
  'phone_change_token',
])
export const request_status = pgEnum('request_status', ['PENDING', 'SUCCESS', 'ERROR'])
export const key_status = pgEnum('key_status', ['default', 'valid', 'invalid', 'expired'])
export const key_type = pgEnum('key_type', [
  'aead-ietf',
  'aead-det',
  'hmacsha512',
  'hmacsha256',
  'auth',
  'shorthash',
  'generichash',
  'kdf',
  'secretbox',
  'secretstream',
  'stream_xchacha20',
])
export const action = pgEnum('action', [
  'INSERT',
  'UPDATE',
  'DELETE',
  'TRUNCATE',
  'ERROR',
])
export const equality_op = pgEnum('equality_op', [
  'eq',
  'neq',
  'lt',
  'lte',
  'gt',
  'gte',
  'in',
])

export const authSchema = pgSchema('auth')

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
})

export const usersInAuth = users

export const categories = pgTable('categories', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const user_stats = pgTable('user_stats', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  profile_id: uuid('profile_id').references(() => users.id),
  mrr: numeric('mrr', { precision: 10, scale: 2 }),
  arr: numeric('arr', { precision: 10, scale: 2 }),
  weekly_post_views: integer('weekly_post_views'),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  avatar_url: text('avatar_url'),
  name: text('name'),
  about: text('about'),
})

export const installs = pgTable('installs', {
  user_id: uuid('user_id')
    .primaryKey()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expo_tokens: text('expo_tokens').default('RRAY[').array(),
})

export const achievements = pgTable('achievements', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  profile_id: uuid('profile_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  progress: integer('progress').notNull(),
  goal: integer('goal').notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const posts = pgTable('posts', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  profile_id: uuid('profile_id').references(() => users.id),
  category_id: uuid('category_id').references(() => categories.id),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  image_url: varchar('image_url', { length: 255 }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const referrals = pgTable('referrals', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  referrer_id: uuid('referrer_id').references(() => users.id),
  referred_id: uuid('referred_id').references(() => users.id),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})

export const events = pgTable('events', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  start_time: timestamp('start_time', { withTimezone: true, mode: 'string' }),
  end_time: timestamp('end_time', { withTimezone: true, mode: 'string' }),
  status: varchar('status', { length: 50 }).notNull(),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  profile_id: uuid('profile_id')
    .notNull()
    .references(() => profiles.id),
})

export const projects = pgTable('projects', {
  id: uuid('id').default(sql`uuid_generate_v4()`).primaryKey().notNull(),
  profile_id: uuid('profile_id').references(() => users.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  number_of_days: integer('number_of_days'),
  paid_project: boolean('paid_project').default(false),
  street: varchar('street', { length: 255 }),
  us_zip_code: varchar('us_zip_code', { length: 10 }),
  project_type: varchar('project_type', { length: 50 }),
  created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true, mode: 'string' })
    .defaultNow()
    .notNull(),
})
