import { createUseStore } from '@tamagui/use-store'
import type Stripe from 'stripe'

class TakeoutStore {
  showPurchase = false
  showFaq = false
  showAgreement = false
  showPolicies = false
  promoInputIsOpen = false
  appliedCoupon: Stripe.Coupon | null = null
  appliedPromoCode: string | null = null
  selectedProductsIds: string[] = []
}

export const useTakeoutStore = createUseStore(TakeoutStore)
