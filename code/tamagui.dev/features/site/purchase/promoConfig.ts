/**
 * promo configuration system
 *
 * this provides a structured way to define promotional offers that:
 * - show a badge on the takeout page
 * - auto-apply coupons when opening purchase modal
 * - display discounted prices throughout the purchase flow
 */

export type PromoConfig = {
  // unique identifier for this promo
  id: string
  // the stripe promotion code (what user enters)
  code: string
  // the stripe coupon id (returned from validation)
  couponId: string
  // display info
  label: string
  description: string
  // discount info for display before validation
  percentOff?: number
  amountOff?: number
  // whether this promo is currently active
  active: boolean
  // optional: when this promo expires (for countdown etc)
  expiresAt?: Date
  // optional: limit number of redemptions
  maxRedemptions?: number
  // theme color for badge
  theme?: 'green' | 'yellow' | 'blue' | 'red'
}

// define active promotions here
export const ACTIVE_PROMOS: PromoConfig[] = [
  {
    id: 'beta-discount',
    code: 'BETA20',
    couponId: '5gXstiW7',
    label: '20% off',
    description: 'beta discount',
    percentOff: 20,
    active: true,
    theme: 'green',
  },
  // legacy promo - deactivated
  {
    id: 'tko2-launch',
    code: 'TKO2',
    couponId: 'ULFkuEYE',
    label: '50% off',
    description: 'during Takeout 2 beta',
    percentOff: 50,
    active: false,
    theme: 'green',
  },
]

// get the currently active promo (first active one)
export function getActivePromo(): PromoConfig | null {
  const now = new Date()
  return (
    ACTIVE_PROMOS.find((promo) => {
      if (!promo.active) return false
      if (promo.expiresAt && promo.expiresAt < now) return false
      return true
    }) || null
  )
}

// get a promo by code
export function getPromoByCode(code: string): PromoConfig | null {
  return ACTIVE_PROMOS.find((p) => p.code.toLowerCase() === code.toLowerCase()) || null
}

// calculate discounted price
export function calculatePromoPrice(
  originalPrice: number,
  promo: PromoConfig | null
): number {
  if (!promo) return originalPrice
  if (promo.percentOff) {
    return Math.ceil(originalPrice * (1 - promo.percentOff / 100))
  }
  if (promo.amountOff) {
    return Math.max(0, originalPrice - promo.amountOff)
  }
  return originalPrice
}
