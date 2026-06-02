import type Stripe from 'stripe'
import { V2_LICENSE_PRICE_CENTS } from './pricing'
import { STRIPE_PRODUCTS } from './products'

type V2LicenseInvoiceItemArgs = {
  stripeCustomerId: string
  parityDiscountPercent: number
  countryCode: string | null
}

export const getV2LicenseInvoiceItemCreateParams = ({
  stripeCustomerId,
  parityDiscountPercent,
  countryCode,
}: V2LicenseInvoiceItemArgs): Stripe.InvoiceItemCreateParams => {
  if (parityDiscountPercent <= 0) {
    return {
      customer: stripeCustomerId,
      price: STRIPE_PRODUCTS.PRO_V2_LICENSE.priceId,
      metadata: {
        version: 'v2',
      },
    }
  }

  const parityAdjustedPrice = Math.round(
    V2_LICENSE_PRICE_CENTS * (1 - parityDiscountPercent / 100)
  )
  const parityCountry = countryCode || ''

  return {
    customer: stripeCustomerId,
    price_data: {
      currency: 'usd',
      product: STRIPE_PRODUCTS.PRO_V2_LICENSE.productId,
      unit_amount: parityAdjustedPrice,
    },
    description: `Tamagui Pro V2 License (${parityDiscountPercent}% parity discount${parityCountry ? ` for ${parityCountry}` : ''})`,
    metadata: {
      version: 'v2',
      parity_discount: String(parityDiscountPercent),
      parity_country: parityCountry,
      original_price_cents: String(V2_LICENSE_PRICE_CENTS),
    },
  }
}
