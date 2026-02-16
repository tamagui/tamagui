const isTestMode =
  process.env.STRIPE_TEST_MODE === 'true' || process.env.NODE_ENV === 'development'

// Test mode products (for local development)
const TEST_PRODUCTS = {
  PRO_V2_LICENSE: {
    productId: 'prod_TzXqrfOfIkbBHW',
    priceId: 'price_1T1YlQFQGtHoG6xcKy2zoanG', // $350 one-time
  },
  PRO_V2_UPGRADE: {
    productId: 'prod_TzXqrfOfIkbBHW',
    priceId: 'price_1T1YlZFQGtHoG6xcQrmlViBL', // $100/year
  },
  SUPPORT_DIRECT: {
    productId: 'prod_TzXrJxfpINP8A4',
    priceId: 'price_1T1YlsFQGtHoG6xctR0JNMhw', // $500/month
  },
  SUPPORT_SPONSOR: {
    productId: 'prod_TzXre5xy4fsDlI',
    priceId: 'price_1T1YlvFQGtHoG6xcjpn8rd30', // $2000/month
  },
  // V1 products not needed in test mode (legacy)
  PRO_SUBSCRIPTION: { productId: '', priceId: '' },
  PRO_ONE_TIME: { productId: '', priceId: '' },
  PRO_TEAM_SEATS: { productId: '', priceId: '' },
  PRO_TEAM_SEATS_ONE_TIME: { productId: '', priceId: '' },
  SUPPORT: { productId: '', priceId: '' },
  CHAT: { productId: '', priceId: '' },
}

// Live mode products (production)
const LIVE_PRODUCTS = {
  // ============================================
  // V2 PRODUCTS (per-project licensing)
  // ============================================

  /**
   * V2 Pro License - $350 one-time per project
   * Includes: all templates (v1 takeout, v2 takeout, takeout static)
   * Includes: 1 year of updates, basic chat support, unlimited team
   */
  PRO_V2_LICENSE: {
    productId: 'prod_TneqayKPO32G63',
    priceId: 'price_1T1YoKFQGtHoG6xcQXOUQeKq', // $350 one-time
  },

  /**
   * V2 Pro Upgrade - $100/year recurring
   * Auto-subscribed on purchase, starts after 1 year
   * Continues access to updates
   */
  PRO_V2_UPGRADE: {
    productId: 'prod_TneqayKPO32G63',
    priceId: 'price_1Sv5TTFQGtHoG6xcm8GJ3Uhg',
  },

  // ============================================
  // V1 PRODUCTS (legacy, per-seat licensing)
  // ============================================

  /**
   * @deprecated V1 - $240/year with auto-renew
   */
  PRO_SUBSCRIPTION: {
    productId: 'prod_RlRd2DVrG0frHe',
    priceId: 'price_1QthHSFQGtHoG6xcDOEuFsrW',
  },

  /**
   * @deprecated V1 - $400 one-time payment
   */
  PRO_ONE_TIME: {
    productId: 'prod_RlRd2DVrG0frHe',
    priceId: 'price_1Qs41HFQGtHoG6xcerDq7RJZ',
  },

  /**
   * @deprecated V1 - Team seats
   */
  PRO_TEAM_SEATS: {
    productId: 'prod_Rxu0x7jR0nWJSv',
    priceId: 'price_1R3yCAFQGtHoG6xcatVUMGL4',
  },

  /**
   * @deprecated V1 - Team seats one-time
   */
  PRO_TEAM_SEATS_ONE_TIME: {
    productId: 'prod_Rxu0x7jR0nWJSv',
    priceId: 'price_1R3yCaFQGtHoG6xcwQ8EtfDu',
  },

  // ============================================
  // V2 SUPPORT PRODUCTS
  // ============================================

  /**
   * V2 Direct Support - $500/month
   * 5 bug fixes/year, 2 business day response, prioritized issues
   */
  SUPPORT_DIRECT: {
    productId: 'prod_TsDjQ6tmdFy7M6',
    priceId: 'price_1SuTIHFQGtHoG6xcSRnWg3xB',
  },

  /**
   * V2 Sponsor Support - $2,000/month
   * Unlimited priority fixes, 1 day response, monthly video call
   */
  SUPPORT_SPONSOR: {
    productId: 'prod_TsDjG5QpL21tT1',
    priceId: 'price_1SuTIVFQGtHoG6xcVVnbEeQx',
  },

  // ============================================
  // V1 SUPPORT PRODUCTS (legacy)
  // ============================================

  /**
   * @deprecated V1 - Premium Support - $800/month per tier
   */
  SUPPORT: {
    productId: 'prod_RlRebXO307MLoH',
    priceId: 'price_1QrulKFQGtHoG6xcDs9OYTFu',
  },

  /**
   * @deprecated V1 only - Chat support $200/month
   * Note: Basic chat support included free in V2
   */
  CHAT: {
    productId: 'prod_RlRdUMAas8elvJ',
    priceId: 'price_1QrukQFQGtHoG6xcMpB125IR',
  },
}

export const STRIPE_PRODUCTS = isTestMode ? TEST_PRODUCTS : LIVE_PRODUCTS

// Product IDs (used for checking subscription status)
export const STRIPE_PRODUCTS_ENUM = {
  // V2
  PRO_V2_LICENSE: STRIPE_PRODUCTS.PRO_V2_LICENSE.productId,
  SUPPORT_DIRECT: STRIPE_PRODUCTS.SUPPORT_DIRECT.productId,
  SUPPORT_SPONSOR: STRIPE_PRODUCTS.SUPPORT_SPONSOR.productId,
  // V1 (legacy)
  PRO_SUBSCRIPTION: STRIPE_PRODUCTS.PRO_SUBSCRIPTION.productId,
  PRO_TEAM_SEATS: STRIPE_PRODUCTS.PRO_TEAM_SEATS.productId,
  SUPPORT: STRIPE_PRODUCTS.SUPPORT.productId,
  CHAT: STRIPE_PRODUCTS.CHAT.productId,
} as const

// V2 products for new purchases
export const V2_PRODUCTS = [
  STRIPE_PRODUCTS_ENUM.PRO_V2_LICENSE,
  STRIPE_PRODUCTS_ENUM.SUPPORT_DIRECT,
  STRIPE_PRODUCTS_ENUM.SUPPORT_SPONSOR,
]

// V1 products (legacy, for existing subscribers)
export const V1_PRODUCTS = [
  STRIPE_PRODUCTS_ENUM.PRO_SUBSCRIPTION,
  STRIPE_PRODUCTS_ENUM.PRO_TEAM_SEATS,
  STRIPE_PRODUCTS_ENUM.SUPPORT,
  STRIPE_PRODUCTS_ENUM.CHAT,
]

// All current products
export const CURRENT_PRODUCTS = [
  // V2 products
  STRIPE_PRODUCTS_ENUM.PRO_V2_LICENSE,
  STRIPE_PRODUCTS_ENUM.SUPPORT_DIRECT,
  STRIPE_PRODUCTS_ENUM.SUPPORT_SPONSOR,
  // V1 products (legacy)
  STRIPE_PRODUCTS_ENUM.PRO_SUBSCRIPTION,
  STRIPE_PRODUCTS_ENUM.PRO_TEAM_SEATS,
  STRIPE_PRODUCTS_ENUM.SUPPORT,
  STRIPE_PRODUCTS_ENUM.CHAT,
]
