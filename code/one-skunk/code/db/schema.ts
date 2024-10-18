import { integer, serial, varchar, text, timestamp, pgTable, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  bio: text('bio').default(''),
  avatarUrl: varchar('avatar_url', { length: 255 }).default(''),
  createdAt: timestamp('created_at').defaultNow(),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const follows = pgTable('follows', {
  followerId: integer('follower_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  followingId: integer('following_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const likes = pgTable(
  'likes',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.postId] }),
    }
  }
)

export const reposts = pgTable(
  'reposts',
  {
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    postId: integer('post_id')
      .references(() => posts.id, { onDelete: 'cascade' })
      .notNull(),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.postId] }),
    }
  }
)

export const replies = pgTable('replies', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  postId: integer('post_id')
    .references(() => posts.id, { onDelete: 'cascade' })
    .notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

export const userRelations = relations(users, ({ one, many }) => ({
  posts: many(posts),
  followers: many(follows, { relationName: 'follower' }),
  followings: many(follows, { relationName: 'following' }),
  likes: many(likes),
  reposts: many(reposts),
  replies: many(replies),
}))

export const postRelations = relations(posts, ({ one, many }) => ({
  user: one(users, {
    relationName: 'user',
    fields: [posts.userId],
    references: [users.id],
  }),
  likes: many(likes),
  reposts: many(reposts),
  replies: many(replies),
}))

export const followRelations = relations(follows, ({ one }) => ({
  follower: one(users, {
    relationName: 'follower',
    fields: [follows.followerId],
    references: [users.id],
  }),
  following: one(users, {
    relationName: 'following',
    fields: [follows.followingId],
    references: [users.id],
  }),
}))

export const likeRelations = relations(likes, ({ one }) => ({
  user: one(users, {
    relationName: 'user',
    fields: [likes.userId],
    references: [users.id],
  }),
  post: one(posts, {
    relationName: 'post',
    fields: [likes.postId],
    references: [posts.id],
  }),
}))

export const repostRelations = relations(reposts, ({ one }) => ({
  user: one(users, {
    relationName: 'user',
    fields: [reposts.userId],
    references: [users.id],
  }),
  post: one(posts, {
    relationName: 'post',
    fields: [reposts.postId],
    references: [posts.id],
  }),
}))

export const replyRelations = relations(replies, ({ one }) => ({
  user: one(users, {
    relationName: 'user',
    fields: [replies.userId],
    references: [users.id],
  }),
  post: one(posts, {
    relationName: 'post',
    fields: [replies.postId],
    references: [posts.id],
  }),
}))
