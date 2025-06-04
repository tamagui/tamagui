export const STRIPE_PRODUCTS = {
  /**
   * $240/year with auto-renew
   */
  PRO_SUBSCRIPTION: {
    productId: 'prod_RlRd2DVrG0frHe',
    priceId: 'price_1QthHSFQGtHoG6xcDOEuFsrW',
  },

  /**
   * $400 one-time payment
   */
  PRO_ONE_TIME: {
    productId: 'prod_RlRd2DVrG0frHe',
    priceId: 'price_1Qs41HFQGtHoG6xcerDq7RJZ',
  },

  PRO_TEAM_SEATS: {
    productId: 'prod_Rxu0x7jR0nWJSv',
    priceId: 'price_1R3yCAFQGtHoG6xcatVUMGL4',
  },

  PRO_TEAM_SEATS_ONE_TIME: {
    productId: 'prod_Rxu0x7jR0nWJSv',
    priceId: 'price_1R3yCaFQGtHoG6xcwQ8EtfDu',
  },

  /**
   * $800/month per tier
   */
  SUPPORT: {
    productId: 'prod_RlRebXO307MLoH',
    priceId: 'price_1QrulKFQGtHoG6xcDs9OYTFu',
  },

  /**
   * $200/month for chat support
   */
  CHAT: {
    productId: 'prod_RlRdUMAas8elvJ',
    priceId: 'price_1QrukQFQGtHoG6xcMpB125IR',
  },
}

export enum STRIPE_PRODUCTS_ENUM {
  PRO_SUBSCRIPTION = 'prod_RlRd2DVrG0frHe',
  PRO_TEAM_SEATS = 'prod_Rxu0x7jR0nWJSv',
  SUPPORT = 'prod_RlRebXO307MLoH',
  CHAT = 'prod_RlRdUMAas8elvJ',
}

export const CURRENT_PRODUCTS = [
  STRIPE_PRODUCTS_ENUM.PRO_SUBSCRIPTION,
  STRIPE_PRODUCTS_ENUM.PRO_TEAM_SEATS,
  STRIPE_PRODUCTS_ENUM.SUPPORT,
  STRIPE_PRODUCTS_ENUM.CHAT,
]
