#!/usr/bin/env node
// @ts-check

/**
 * Create Promotion Codes for Coupons
 *
 * Creates promotion codes that users can enter at checkout.
 * These link to underlying coupons.
 *
 * Usage:
 *   node scripts/create-promotion-codes.mjs [--dry-run]
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
    name: 'Tamagui Promo Code Creator',
    version: '0.1.0',
  },
})

const isDryRun = process.argv.includes('--dry-run')

// promotion codes to create: { code, couponId, maxRedemptions }
const promoCodes = [
  {
    code: 'WELCOMEBACK30',
    couponId: 'WELCOMEBACK30',
    maxRedemptions: 500,
  },
]

async function createPromoCode({ code, couponId, maxRedemptions }) {
  // check if an active promotion code already exists
  try {
    const existing = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    })

    if (existing.data.length > 0) {
      const promo = existing.data[0]
      // also check if it's exhausted
      if (promo.max_redemptions && promo.times_redeemed >= promo.max_redemptions) {
        console.log(
          `⚠ ${code}: exists but exhausted (${promo.times_redeemed}/${promo.max_redemptions}), creating new`
        )
        // fall through to create new one
      } else {
        console.log(
          `✓ ${code}: already exists and active (coupon: ${promo.coupon.id}, redeemed: ${promo.times_redeemed || 0})`
        )
        return promo
      }
    }
  } catch (err) {
    // continue to create
  }

  // verify coupon exists
  try {
    await stripe.coupons.retrieve(couponId)
  } catch (err) {
    console.log(`✗ ${code}: coupon ${couponId} not found`)
    return null
  }

  if (isDryRun) {
    console.log(`DRY RUN - would create promotion code ${code} for coupon ${couponId}`)
    return null
  }

  try {
    const promoCode = await stripe.promotionCodes.create({
      code,
      coupon: couponId,
      max_redemptions: maxRedemptions,
      metadata: {
        created_by: 'create-promotion-codes.mjs',
      },
    })

    console.log(`✓ ${code}: created successfully (max: ${maxRedemptions})`)
    return promoCode
  } catch (err) {
    console.log(`✗ ${code}: failed - ${err.message}`)
    return null
  }
}

async function main() {
  console.log('Creating promotion codes...\n')

  for (const config of promoCodes) {
    await createPromoCode(config)
  }

  console.log('\nDone!')
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
