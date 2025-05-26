export enum WhitelistType {
  Pro = 'pro',
  Chat = 'chat',
}

export enum ProductName {
  TamaguiPro = 'Tamagui Pro',
  TamaguiChat = 'Tamagui Chat',
  TamaguiSupport = 'Tamagui Support',
  TamaguiProTeamSeats = 'Tamagui Pro Team Seats',
  TamaguiBento = 'Bento',
  TamaguiTakeoutStack = 'Takeout Stack',
}

export enum ProductSlug {
  UniversalStarter = 'universal-starter',
  IconPacks = 'icon-packs',
  FontPacks = 'font-packs',
  Bento = 'bento',
}

export enum SubscriptionStatus {
  Trialing = 'trialing',
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Unpaid = 'unpaid',
}

export enum PriceType {
  Recurring = 'recurring',
  OneTime = 'one_time',
}

export type UserSubscriptionStatus = {
  pro: boolean
  chat: boolean
  supportTier: number
  teamSeats: number
  couponCodes: {
    [key: string]: string
  }
}
