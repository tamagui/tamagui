import { describe, expect, it } from 'vitest'
import { STRIPE_PRODUCTS } from '../products'
import { getV2LicenseInvoiceItemCreateParams } from '../v2LicenseInvoiceItem'

describe('getV2LicenseInvoiceItemCreateParams', () => {
  it('uses the canonical V2 license price without a parity discount', () => {
    const params = getV2LicenseInvoiceItemCreateParams({
      stripeCustomerId: 'cus_test',
      parityDiscountPercent: 0,
      countryCode: null,
    })

    expect(params).toMatchObject({
      customer: 'cus_test',
      price: STRIPE_PRODUCTS.PRO_V2_LICENSE.priceId,
      metadata: {
        version: 'v2',
      },
    })
    expect(params).not.toHaveProperty('price_data')
  })

  it('keeps parity discount prices attached to the canonical V2 product', () => {
    const params = getV2LicenseInvoiceItemCreateParams({
      stripeCustomerId: 'cus_test',
      parityDiscountPercent: 25,
      countryCode: 'SA',
    })

    expect(params).toMatchObject({
      customer: 'cus_test',
      price_data: {
        currency: 'usd',
        product: STRIPE_PRODUCTS.PRO_V2_LICENSE.productId,
        unit_amount: 18750,
      },
      metadata: {
        version: 'v2',
        parity_discount: '25',
        parity_country: 'SA',
        original_price_cents: '25000',
      },
    })
    expect(params).not.toHaveProperty('amount')
  })
})
