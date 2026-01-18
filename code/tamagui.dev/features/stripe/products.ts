export const STRIPE_PRODUCTS = {
  // ============================================
  // V2 PRODUCTS (per-project licensing)
  // ============================================

  /**
   * V2 Pro License - $999 one-time per project
   * Includes: all templates (v1 takeout, v2 takeout, takeout static)
   * Includes: 1 year of updates, basic chat support, unlimited team
   */
  PRO_V2_LICENSE: {
    productId: 'prod_TneqayKPO32G63',
    priceId: 'price_1SqrKiFQGtHoG6xcdtyX4gqX',
  },

  /**
   * V2 Pro Upgrade - $300/year recurring
   * Auto-subscribed on purchase, starts after 1 year
   * Continues access to updates
   */
  PRO_V2_UPGRADE: {
    productId: 'prod_TneqayKPO32G63',
    priceId: 'price_1Sq3WuFQGtHoG6xcVkYcfauv',
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
  // SUPPORT PRODUCTS (both v1 and v2)
  // ============================================

  /**
   * Premium Support - $800/month per tier
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

export enum STRIPE_PRODUCTS_ENUM {
  // V2
  PRO_V2_LICENSE = 'prod_TneqayKPO32G63',
  // V1 (legacy)
  PRO_SUBSCRIPTION = 'prod_RlRd2DVrG0frHe',
  PRO_TEAM_SEATS = 'prod_Rxu0x7jR0nWJSv',
  SUPPORT = 'prod_RlRebXO307MLoH',
  CHAT = 'prod_RlRdUMAas8elvJ',
}

// V2 products for new purchases
export const V2_PRODUCTS = [
  STRIPE_PRODUCTS_ENUM.PRO_V2_LICENSE,
  STRIPE_PRODUCTS_ENUM.SUPPORT,
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
  STRIPE_PRODUCTS_ENUM.PRO_V2_LICENSE,
  STRIPE_PRODUCTS_ENUM.PRO_SUBSCRIPTION,
  STRIPE_PRODUCTS_ENUM.PRO_TEAM_SEATS,
  STRIPE_PRODUCTS_ENUM.SUPPORT,
  STRIPE_PRODUCTS_ENUM.CHAT,
]
