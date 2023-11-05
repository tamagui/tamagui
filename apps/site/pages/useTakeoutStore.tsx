import { createUseStore } from '@tamagui/use-store'
import Stripe from 'stripe'

class TakeoutStore {
  showPurchase = false
  showFaq = false
  showAgreement = false
  promoInputIsOpen = false
  appliedCoupon: Stripe.Coupon | null = null
  appliedPromoCode: string | null = null
}

export const useTakeoutStore = createUseStore(TakeoutStore)
