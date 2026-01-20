import { createStore, createUseStore } from '@tamagui/use-store'
import type { PromoConfig } from './promoConfig'

class PurchaseModal {
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
  // promo support
  activePromo: PromoConfig | null = null
  prefilledCouponCode: string | null = null
}

export const purchaseModal = createStore(PurchaseModal)
export const usePurchaseModal = createUseStore(PurchaseModal)
