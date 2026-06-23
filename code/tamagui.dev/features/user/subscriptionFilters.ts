import { CURRENT_PRODUCTS } from '~/features/stripe/products'
import { SubscriptionStatus } from '~/shared/types/subscription'

// minimal structural shape we need to classify a subscription - keeps these predicates
// usable from both the account UI and tests without dragging in the full context types.
type ClassifiableSubscription = {
  status?: string | null
  subscription_items?: Array<{
    price?: { product?: { id?: string | null } | null } | null
  } | null> | null
}

// statuses that represent a live subscription the user can still manage/cancel.
// past_due/unpaid are included on purpose: when a renewal payment fails, Stripe keeps the
// subscription live and retries it. if we hide those, the user sees "no subscription"
// during the retry window and gets charged with no way to stop it.
const MANAGEABLE_STATUSES: string[] = [
  SubscriptionStatus.Active,
  SubscriptionStatus.Trialing,
  SubscriptionStatus.PastDue,
  SubscriptionStatus.Unpaid,
]

const PAST_DUE_STATUSES: string[] = [
  SubscriptionStatus.PastDue,
  SubscriptionStatus.Unpaid,
]

// truly finished subscriptions - shown as "expired" with renewal prompts, not as manageable.
const EXPIRED_STATUSES: string[] = [
  SubscriptionStatus.Canceled,
  SubscriptionStatus.IncompleteExpired,
]

const hasCurrentProduct = (sub: ClassifiableSubscription): boolean =>
  sub.subscription_items?.some(
    (item) =>
      !!item?.price?.product?.id &&
      CURRENT_PRODUCTS.includes(item.price.product.id as any)
  ) ?? false

export const isManageableSubscription = (sub: ClassifiableSubscription): boolean =>
  !!sub.status && MANAGEABLE_STATUSES.includes(sub.status) && hasCurrentProduct(sub)

export const isExpiredSubscription = (sub: ClassifiableSubscription): boolean =>
  !!sub.status && EXPIRED_STATUSES.includes(sub.status) && hasCurrentProduct(sub)

export const isPastDueSubscription = (sub: ClassifiableSubscription): boolean =>
  !!sub.status && PAST_DUE_STATUSES.includes(sub.status)
