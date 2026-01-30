#!/usr/bin/env node

/**
 * Creates new V2 pricing in Stripe:
 * - $400 one-time license (down from $999)
 * - $100/year renewal (down from $300)
 * - 20% beta discount coupon
 *
 * Run with: node scripts/create-new-pricing.mjs
 */

import 'dotenv/config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

// existing product id for Tamagui Pro V2
const PRODUCT_ID = 'prod_TneqayKPO32G63'

async function createNewPricing() {
  console.info('Creating new Tamagui Pro V2 pricing in Stripe...\n')

  // 1. Create the $400 one-time license price
  console.info('Creating price: $400 one-time license...')
  const licensePrice = await stripe.prices.create({
    product: PRODUCT_ID,
    unit_amount: 40000, // $400 in cents
    currency: 'usd',
    metadata: {
      version: 'v2',
      type: 'license',
      note: 'new-pricing-jan-2026',
    },
  })
  console.info(`  Price ID: ${licensePrice.id}\n`)

  // 2. Create the $100/year recurring upgrade price
  console.info('Creating price: $100/year upgrade subscription...')
  const upgradePrice = await stripe.prices.create({
    product: PRODUCT_ID,
    unit_amount: 10000, // $100 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
      interval_count: 1,
    },
    metadata: {
      version: 'v2',
      type: 'upgrade',
      note: 'new-pricing-jan-2026',
    },
  })
  console.info(`  Price ID: ${upgradePrice.id}\n`)

  // 3. Create a 20% beta discount coupon
  console.info('Creating coupon: 20% beta discount...')
  const coupon = await stripe.coupons.create({
    percent_off: 20,
    duration: 'once',
    name: 'Beta Discount 20%',
    metadata: {
      note: 'new-pricing-jan-2026',
    },
  })
  console.info(`  Coupon ID: ${coupon.id}\n`)

  // 4. Create a promotion code for the coupon
  console.info('Creating promotion code: BETA20...')
  const promoCode = await stripe.promotionCodes.create({
    coupon: coupon.id,
    code: 'BETA20',
    metadata: {
      note: 'new-pricing-jan-2026',
    },
  })
  console.info(`  Promotion Code ID: ${promoCode.id}\n`)

  // Output the IDs to update in products.ts
  console.info('='.repeat(60))
  console.info('\nUpdate features/stripe/products.ts with these values:\n')
  console.info(`PRO_V2_LICENSE: {
  productId: '${PRODUCT_ID}',
  priceId: '${licensePrice.id}',
},

PRO_V2_UPGRADE: {
  productId: '${PRODUCT_ID}',
  priceId: '${upgradePrice.id}',
},`)
  console.info('\n' + '='.repeat(60))

  console.info(`
Update features/site/purchase/paymentModalStore.ts:

export const V2_LICENSE_PRICE = 400 // $400 one-time
export const V2_UPGRADE_PRICE = 100 // $100/year for updates
`)

  console.info(`
Update features/site/purchase/promoConfig.ts:

{
  id: 'beta-discount',
  code: 'BETA20',
  couponId: '${coupon.id}',
  label: '20% off',
  description: 'beta discount',
  percentOff: 20,
  active: true,
  theme: 'green',
},
`)

  return {
    licensePriceId: licensePrice.id,
    upgradePriceId: upgradePrice.id,
    couponId: coupon.id,
    promoCodeId: promoCode.id,
  }
}

createNewPricing()
  .then((ids) => {
    console.info('\nDone! New pricing created successfully.')
    console.info('\nCreated IDs:')
    console.info(JSON.stringify(ids, null, 2))
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error creating pricing:', error)
    process.exit(1)
  })
