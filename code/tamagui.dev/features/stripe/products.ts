const DEV = process.env.NEXT_PUBLIC_IS_LOCAL === 'true'

export const STRIPE_PRODUCTS = {
  /**
   * $240/year with auto-renew
   */
  PRO_SUBSCRIPTION: {
    productId: DEV ? 'prod_Rzbsj5bpG5mD57' : 'prod_RlRd2DVrG0frHe',
    priceId: DEV ? 'price_1R5cefFQGtHoG6xc4kkvZbTY' : 'price_1QthHSFQGtHoG6xcDOEuFsrW',
  },

  /**
   * $400 one-time payment
   */
  PRO_ONE_TIME: {
    productId: DEV ? 'prod_Rzbsj5bpG5mD57' : 'prod_RlRd2DVrG0frHe',
    priceId: DEV ? 'price_1R5cfBFQGtHoG6xc1S72yoOl' : 'price_1Qs41HFQGtHoG6xcerDq7RJZ',
  },

  /**
   * $800/month per tier
   */
  SUPPORT: {
    productId: DEV ? 'prod_RzbuTN44SbSPlv' : 'prod_RlRebXO307MLoH',
    priceId: DEV ? 'price_1R5cglFQGtHoG6xc4ahRwi08' : 'price_1QrulKFQGtHoG6xcDs9OYTFu',
  },

  /**
   * $200/month for chat support
   */
  CHAT: {
    productId: DEV ? 'prod_RzbtsfcAvTJjEn' : 'prod_RlRdUMAas8elvJ',
    priceId: DEV ? 'price_1R5cg1FQGtHoG6xc5IScIOQt' : 'price_1QrukQFQGtHoG6xcMpB125IR',
  },
}
