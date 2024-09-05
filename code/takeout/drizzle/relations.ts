import { relations } from 'drizzle-orm/relations'
import {
  usersInAuth,
  user_stats,
  profiles,
  installs,
  achievements,
  categories,
  posts,
  referrals,
  events,
  projects,
} from './schema'

export const user_statsRelations = relations(user_stats, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [user_stats.profile_id],
    references: [usersInAuth.id],
  }),
}))

export const usersInAuthRelations = relations(usersInAuth, ({ many }) => ({
  user_stats: many(user_stats),
  profiles: many(profiles),
  installs: many(installs),
  achievements: many(achievements),
  posts: many(posts),
  referrals_referred_id: many(referrals, {
    relationName: 'referrals_referred_id_usersInAuth_id',
  }),
  referrals_referrer_id: many(referrals, {
    relationName: 'referrals_referrer_id_usersInAuth_id',
  }),
  projects: many(projects),
}))

export const profilesRelations = relations(profiles, ({ one, many }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [profiles.id],
    references: [usersInAuth.id],
  }),
  events: many(events),
}))

export const installsRelations = relations(installs, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [installs.user_id],
    references: [usersInAuth.id],
  }),
}))

export const achievementsRelations = relations(achievements, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [achievements.profile_id],
    references: [usersInAuth.id],
  }),
}))

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.category_id],
    references: [categories.id],
  }),
  usersInAuth: one(usersInAuth, {
    fields: [posts.profile_id],
    references: [usersInAuth.id],
  }),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}))

export const referralsRelations = relations(referrals, ({ one }) => ({
  usersInAuth_referred_id: one(usersInAuth, {
    fields: [referrals.referred_id],
    references: [usersInAuth.id],
    relationName: 'referrals_referred_id_usersInAuth_id',
  }),
  usersInAuth_referrer_id: one(usersInAuth, {
    fields: [referrals.referrer_id],
    references: [usersInAuth.id],
    relationName: 'referrals_referrer_id_usersInAuth_id',
  }),
}))

export const eventsRelations = relations(events, ({ one }) => ({
  profile: one(profiles, {
    fields: [events.profile_id],
    references: [profiles.id],
  }),
}))

export const projectsRelations = relations(projects, ({ one }) => ({
  usersInAuth: one(usersInAuth, {
    fields: [projects.profile_id],
    references: [usersInAuth.id],
  }),
}))
