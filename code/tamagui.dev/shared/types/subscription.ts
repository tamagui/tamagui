export const Whitelist = {
  Pro: 'pro',
  Chat: 'chat',
} as const

export const ProductName = {
  TamaguiPro: 'Tamagui Pro',
  TamaguiChat: 'Tamagui Chat',
  TamaguiSupport: 'Tamagui Support',
  TamaguiProTeamSeats: 'Tamagui Pro Team Seats',
  TamaguiBento: 'Bento',
  TamaguiTakeoutStack: 'Takeout Stack',
} as const

export const ProductSlug = {
  UniversalStarter: 'universal-starter',
  IconPacks: 'icon-packs',
  FontPacks: 'font-packs',
  Bento: 'bento',
} as const

export const SubscriptionStatus = {
  Trialing: 'trialing',
  Active: 'active',
  Canceled: 'canceled',
  Incomplete: 'incomplete',
  IncompleteExpired: 'incomplete_expired',
  PastDue: 'past_due',
  Unpaid: 'unpaid',
} as const

export const Pricing = {
  Recurring: 'recurring',
  OneTime: 'one_time',
} as const

// Type helpers to get the values
export type WhitelistType = (typeof Whitelist)[keyof typeof Whitelist]
export type ProductNameType = (typeof ProductName)[keyof typeof ProductName]
export type ProductSlugType = (typeof ProductSlug)[keyof typeof ProductSlug]
export type SubscriptionStatusType =
  (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]
export type PricingType = (typeof Pricing)[keyof typeof Pricing]

export type UserSubscriptionStatus = {
  pro: boolean
  chat: boolean
  supportTier: number
  teamSeats: number
  couponCodes: {
    [key: string]: string
  }
}
