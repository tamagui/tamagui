import { createUseStore } from '@tamagui/use-store'
import Stripe from 'stripe'

class BentoStore {
  showPurchase = false
  showFaq = false
  showAgreement = false
  promoInputIsOpen = false
  appliedCoupon: Stripe.Coupon | null = null
  appliedPromoCode: string | null = null
}

export const useBentoStore = createUseStore(BentoStore)
