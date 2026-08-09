import { describe, expect, it } from 'vitest'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import {
  isExpiredSubscription,
  isManageableSubscription,
  isPastDueSubscription,
} from '../subscriptionFilters'

// a current (V1 Pro) product id - present in CURRENT_PRODUCTS
const proProductId = STRIPE_PRODUCTS.PRO_SUBSCRIPTION.productId

const sub = (status: string, productId: string | null = proProductId) => ({
  status,
  subscription_items: [{ price: { product: { id: productId } } }],
})

describe('subscriptionFilters', () => {
  it('treats active and trialing subs as manageable', () => {
    expect(isManageableSubscription(sub('active'))).toBe(true)
    expect(isManageableSubscription(sub('trialing'))).toBe(true)
  })

  // the core regression: a failed-renewal sub must stay visible/cancellable, not hidden.
  it('treats past_due and unpaid subs as manageable (the bug fix)', () => {
    expect(isManageableSubscription(sub('past_due'))).toBe(true)
    expect(isManageableSubscription(sub('unpaid'))).toBe(true)
  })

  it('does not treat past_due/unpaid as expired', () => {
    expect(isExpiredSubscription(sub('past_due'))).toBe(false)
    expect(isExpiredSubscription(sub('unpaid'))).toBe(false)
  })

  it('treats canceled and incomplete_expired as expired, not manageable', () => {
    expect(isExpiredSubscription(sub('canceled'))).toBe(true)
    expect(isExpiredSubscription(sub('incomplete_expired'))).toBe(true)
    expect(isManageableSubscription(sub('canceled'))).toBe(false)
  })

  it('flags past_due/unpaid for immediate cancellation messaging', () => {
    expect(isPastDueSubscription(sub('past_due'))).toBe(true)
    expect(isPastDueSubscription(sub('unpaid'))).toBe(true)
    expect(isPastDueSubscription(sub('active'))).toBe(false)
  })

  it('ignores subs without a current product', () => {
    expect(isManageableSubscription(sub('active', 'prod_unknown'))).toBe(false)
    expect(isExpiredSubscription(sub('canceled', 'prod_unknown'))).toBe(false)
  })

  it('handles null/missing status safely', () => {
    expect(isManageableSubscription(sub(null as any))).toBe(false)
    expect(isManageableSubscription({})).toBe(false)
  })
})
