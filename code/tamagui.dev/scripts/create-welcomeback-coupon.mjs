#!/usr/bin/env node
// @ts-check

/**
 * Create WELCOMEBACK30 Coupon
 *
 * Creates the 30% off coupon for returning customers.
 *
 * Usage:
 *   node scripts/create-welcomeback-coupon.mjs [--dry-run]
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Coupon Creator',
    version: '0.1.0',
  },
})

const isDryRun = process.argv.includes('--dry-run')

async function main() {
  const couponId = 'WELCOMEBACK30'

  console.log('Creating WELCOMEBACK30 coupon...\n')

  // check if it already exists
  try {
    const existing = await stripe.coupons.retrieve(couponId)
    console.log('Coupon already exists:')
    console.log(`  ID: ${existing.id}`)
    console.log(`  Discount: ${existing.percent_off}% off`)
    console.log(`  Times redeemed: ${existing.times_redeemed}`)
    console.log(`  Max redemptions: ${existing.max_redemptions || 'unlimited'}`)
    return
  } catch (err) {
    if (err.code !== 'resource_missing') {
      throw err
    }
    console.log('Coupon does not exist, creating...\n')
  }

  if (isDryRun) {
    console.log('DRY RUN - would create:')
    console.log({
      id: couponId,
      percent_off: 30,
      duration: 'once',
      max_redemptions: 500,
      metadata: {
        description: 'Welcome back discount for returning customers',
        created_by: 'script',
      },
    })
    return
  }

  const coupon = await stripe.coupons.create({
    id: couponId,
    percent_off: 30,
    duration: 'once',
    max_redemptions: 500,
    metadata: {
      description: 'Welcome back discount for returning customers',
      created_by: 'create-welcomeback-coupon.mjs',
    },
  })

  console.log('✓ Coupon created successfully!')
  console.log(`  ID: ${coupon.id}`)
  console.log(`  Discount: ${coupon.percent_off}% off`)
  console.log(`  Max redemptions: ${coupon.max_redemptions}`)
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
