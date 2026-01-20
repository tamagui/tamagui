import { createStore, createUseStore } from '@tamagui/use-store'
import type { PromoConfig } from './promoConfig'

class PaymentModal {
  show = false
  yearlyTotal = 0
  monthlyTotal = 0
  disableAutoRenew = false
  chatSupport = false
  supportTier = 0
  teamSeats = 0
  selectedPrices = {
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 0,
    teamSeats: 0,
  }
  // V2 fields
  isV2 = true // Default to V2 for new purchases
  projectName = ''
  projectDomain = ''
  // promo support
  activePromo: PromoConfig | null = null
  prefilledCouponCode: string | null = null
}

export const paymentModal = createStore(PaymentModal)
export const usePaymentModal = createUseStore(PaymentModal)

// V2 Pro pricing constants
export const V2_LICENSE_PRICE = 999 // $999 one-time
export const V2_UPGRADE_PRICE = 300 // $300/year for updates
