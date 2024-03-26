import { createUseStore } from '@tamagui/use-store'
import type Stripe from 'stripe'

class TakeoutStore {
  showPurchase = false
  showTakeoutFaq = false
  showTakeoutAgreement = false
  showBentoFaq = false
  showBentoAgreement = false
  showTakeoutPolicies = false
  showBentoPolicies = false
  promoInputIsOpen = false
  appliedCoupon: Stripe.Coupon | null = null
  appliedPromoCode: string | null = null
}

export const useTakeoutStore = createUseStore(TakeoutStore)
