import { createStore, createUseStore } from '@tamagui/use-store'
import type { PromoConfig } from './promoConfig'

// V2 support tier configuration
export const SUPPORT_TIERS = {
  chat: {
    label: 'Chat',
    price: 0,
    priceLabel: 'included',
    description:
      'Access to the private #takeout Discord channel. No SLA guarantee, but we typically respond within a few days.',
  },
  direct: {
    label: 'Direct',
    price: 500,
    priceLabel: '$500/mo',
    description:
      '5 bug fixes per year, guaranteed response within 2 business days, your issues get prioritized in our queue.',
  },
  sponsor: {
    label: 'Sponsor',
    price: 2000,
    priceLabel: '$2,000/mo',
    description:
      'Unlimited higher priority bug fixes, 1 day response time, plus a monthly video call with the team.',
  },
} as const

export type SupportTier = keyof typeof SUPPORT_TIERS

class PaymentModal {
  show = false
  yearlyTotal = 0
  monthlyTotal = 0
  disableAutoRenew = false
  chatSupport = false
  supportTier: SupportTier = 'chat'
  teamSeats = 0
  selectedPrices = {
    disableAutoRenew: false,
    chatSupport: false,
    supportTier: 'chat' as SupportTier,
    teamSeats: 0,
  }
  // V2 fields
  isV2 = true // Default to V2 for new purchases
  projectName = ''
  projectDomain = ''
  // Support tier upgrade only (no license purchase)
  isSupportUpgradeOnly = false
  // promo support
  activePromo: PromoConfig | null = null
  prefilledCouponCode: string | null = null
  // parity discount (stacks with promo)
  parityDiscount: number = 0
  parityCountry: string | null = null
}

export const paymentModal = createStore(PaymentModal)
export const usePaymentModal = createUseStore(PaymentModal)

// V2 Pro pricing constants
export const V2_LICENSE_PRICE = 350 // $350 one-time
export const V2_UPGRADE_PRICE = 100 // $100/year for updates
