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
 */
const calculateSupportTier = (
  subscriptions: UserContextType['subscriptions']
): number => {
  if (!subscriptions) return 0

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
      // This File is encrpyted so its safe to hardcode the coupon code here.
      couponCodes: { previouslySubscribed: 'TAMAGUI_PRO_RENEWAL' },
    }

  const isPro =
    hasProductAccess(userData.subscriptions, ProductName.TamaguiPro) ||
    hasProductAccess(userData.subscriptions, ProductName.TamaguiProTeamSeats)

  const isChat = hasProductAccess(userData.subscriptions, ProductName.TamaguiChat)

  const supportTier = calculateSupportTier(userData.subscriptions) || 0

  return {
    pro: isPro,
    chat: isChat,
    supportTier,
    teamSeats: calculateTeamSeats(userData.subscriptions),
    // This File is encrpyted so its safe to hardcode the coupon code here.
    couponCodes: {
      previouslySubscribed: 'RENEWAL04',
    },
  }
}
