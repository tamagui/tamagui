/**
 * This file contains the whitelist of users who are allowed to access the subscription features.
 */
import type { UserContextType } from '~/features/auth/types'
import {
  ProductName,
  SubscriptionStatus,
  type ProductNameType,
  type UserSubscriptionStatus,
} from '~/shared/types/subscription'

/**
 * Check if a subscription has specific product access
 */
const hasProductAccess = (
  subscriptions: UserContextType['subscriptions'],
  productName: ProductNameType
): boolean => {
  return (
    subscriptions?.some(
      (sub) =>
        (sub.status === SubscriptionStatus.Active ||
          sub.status === SubscriptionStatus.Trialing) &&
        sub.subscription_items?.some((item) => item.price?.product?.name === productName)
    ) ?? false
  )
}

/**
 * Calculate support tier from subscription data
 * V2 support tiers: direct = 1, sponsor = 2
 * V1 support tier: based on quantity
 */
const calculateSupportTier = (
  subscriptions: UserContextType['subscriptions']
): number => {
  if (!subscriptions) return 0

  // Check V2 sponsor support first (highest tier)
  const hasSponsor = subscriptions.some(
    (sub) =>
      sub.subscription_items?.some(
        (item) => item.price?.product?.name === ProductName.TamaguiSupportSponsor
      ) &&
      (sub.status === SubscriptionStatus.Active ||
        sub.status === SubscriptionStatus.Trialing)
  )
  if (hasSponsor) return 2

  // Check V2 direct support
  const hasDirect = subscriptions.some(
    (sub) =>
      sub.subscription_items?.some(
        (item) => item.price?.product?.name === ProductName.TamaguiSupportDirect
      ) &&
      (sub.status === SubscriptionStatus.Active ||
        sub.status === SubscriptionStatus.Trialing)
  )
  if (hasDirect) return 1

  // V1 support (legacy)
  const supportItem = subscriptions.find((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.price?.product?.name === ProductName.TamaguiSupport &&
        (sub.status === SubscriptionStatus.Active ||
          sub.status === SubscriptionStatus.Trialing)
    )
  )

  return supportItem?.quantity ?? 0
}

const calculateTeamSeats = (subscriptions: UserContextType['subscriptions']): number => {
  if (!subscriptions) return 0

  return (
    subscriptions.find((sub) =>
      sub.subscription_items?.some(
        (item) =>
          item.price?.product?.name === ProductName.TamaguiProTeamSeats &&
          (sub.status === SubscriptionStatus.Active ||
            sub.status === SubscriptionStatus.Trialing)
      )
    )?.quantity ?? 0
  )
}

/**
 * Get the subscription status of a user.
 */
export const userSubscriptionStatus = (
  userData?: UserContextType
): UserSubscriptionStatus => {
  if (!userData)
    return {
      pro: false,
      chat: false,
      supportTier: 0,
      teamSeats: 0,
      couponCodes: { previouslySubscribed: 'TAMAGUI_PRO_RENEWAL' },
    }

  const isPro =
    // V1 products
    hasProductAccess(userData.subscriptions, ProductName.TamaguiPro) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProTeamSeats) ||
    // V2 products
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProV2) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProV2Upgrade) ||
    // V2 support tiers also imply Pro access (support is add-on to Pro license)
    hasProductAccess(userData.subscriptions, ProductName.TamaguiSupportDirect) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiSupportSponsor)

  const isChat =
    // V1 chat
    hasProductAccess(userData.subscriptions, ProductName.TamaguiChat) ||
    // V2 Pro includes basic chat support
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProV2) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProV2Upgrade) ||
    // V2 support tiers include chat
    hasProductAccess(userData.subscriptions, ProductName.TamaguiSupportDirect) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiSupportSponsor)

  const supportTier = calculateSupportTier(userData.subscriptions) || 0

  return {
    pro: isPro,
    chat: isChat,
    supportTier,
    teamSeats: calculateTeamSeats(userData.subscriptions),
    couponCodes: {
      previouslySubscribed: 'RENEWAL04',
    },
  }
}
