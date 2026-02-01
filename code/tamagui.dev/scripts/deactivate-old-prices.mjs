#!/usr/bin/env node

/**
 * Deactivates old V2 pricing in Stripe:
 * - price_1SqrKiFQGtHoG6xcdtyX4gqX ($999 license)
 * - price_1Sq3WuFQGtHoG6xcVkYcfauv ($300/year upgrade)
 *
 * Run with: node scripts/deactivate-old-prices.mjs
 */

import 'dotenv/config'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

const OLD_PRICES = [
  { id: 'price_1SqrKiFQGtHoG6xcdtyX4gqX', description: '$999 license' },
  { id: 'price_1Sq3WuFQGtHoG6xcVkYcfauv', description: '$300/year upgrade' },
]

async function deactivateOldPrices() {
  console.info('Deactivating old Tamagui Pro V2 prices in Stripe...\n')

  for (const price of OLD_PRICES) {
    try {
      console.info(`Deactivating ${price.description} (${price.id})...`)
      await stripe.prices.update(price.id, {
        active: false,
      })
      console.info(`  ✓ Deactivated\n`)
    } catch (error) {
      console.error(`  ✗ Failed to deactivate ${price.id}:`, error.message)
    }
  }

  console.info('Done!')
}

deactivateOldPrices()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error)
    process.exit(1)
  })
