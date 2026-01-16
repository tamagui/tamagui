#!/usr/bin/env node

/**
 * Creates the V2 Pro products and prices in Stripe
 *
 * Run with: node scripts/create-v2-stripe-products.mjs
 */

import 'dotenv/config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

async function createV2Products() {
  console.log('Creating Tamagui Pro V2 products in Stripe...\n')

  // 1. Create the V2 Pro License product
  console.log('Creating product: Tamagui Pro V2...')
  const product = await stripe.products.create({
    name: 'Tamagui Pro V2',
    description: 'Per-project license for Tamagui Pro. Includes all templates (v1 Takeout, v2 Takeout, Takeout Static), Bento components, 1 year of updates, unlimited team members, and basic chat support. Lifetime rights to downloaded code.',
    metadata: {
      version: 'v2',
      type: 'license',
    },
  })
  console.log(`  Product ID: ${product.id}\n`)

  // 2. Create the $1,500 one-time license price
  console.log('Creating price: $1,500 one-time license...')
  const licensePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 150000, // $1,500 in cents
    currency: 'usd',
    metadata: {
      version: 'v2',
      type: 'license',
    },
  })
  console.log(`  Price ID: ${licensePrice.id}\n`)

  // 3. Create the $300/year recurring upgrade price
  console.log('Creating price: $300/year upgrade subscription...')
  const upgradePrice = await stripe.prices.create({
    product: product.id,
    unit_amount: 30000, // $300 in cents
    currency: 'usd',
    recurring: {
      interval: 'year',
      interval_count: 1,
    },
    metadata: {
      version: 'v2',
      type: 'upgrade',
    },
  })
  console.log(`  Price ID: ${upgradePrice.id}\n`)

  // Output the IDs to update in products.ts
  console.log('=' .repeat(60))
  console.log('\nUpdate features/stripe/products.ts with these values:\n')
  console.log(`PRO_V2_LICENSE: {
  productId: '${product.id}',
  priceId: '${licensePrice.id}',
},

PRO_V2_UPGRADE: {
  productId: '${product.id}',
  priceId: '${upgradePrice.id}',
},`)
  console.log('\n' + '=' .repeat(60))

  console.log(`
Also update the enum:

export enum STRIPE_PRODUCTS_ENUM {
  PRO_V2_LICENSE = '${product.id}',
  // ... rest of enum
}
`)

  return {
    productId: product.id,
    licensePriceId: licensePrice.id,
    upgradePriceId: upgradePrice.id,
  }
}

createV2Products()
  .then((ids) => {
    console.log('\nDone! Products created successfully.')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Error creating products:', error)
    process.exit(1)
  })
