#!/usr/bin/env node
// @ts-check

/**
 * Test Subscription States
 *
 * Tests the various subscription states to verify API behavior for:
 * - active subscriptions
 * - past_due subscriptions (migrated without payment method)
 * - trialing subscriptions nearing expiration
 * - canceled subscriptions
 * - incomplete_expired subscriptions
 *
 * Uses Stripe TEST environment.
 *
 * Usage:
 *   STRIPE_TEST_MODE=true node scripts/test-subscription-states.mjs
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

// force test mode
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY_TEST
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY_TEST is not set. Set it in .env or environment.')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Subscription Test',
    version: '0.1.0',
  },
})

console.log('Using Stripe TEST environment\n')

async function countSubscriptionsByStatus() {
  const statuses = [
    'active',
    'trialing',
    'past_due',
    'canceled',
    'incomplete_expired',
    'incomplete',
  ]
  const counts = {}

  for (const status of statuses) {
    let count = 0
    let hasMore = true
    let startingAfter

    while (hasMore) {
      const response = await stripe.subscriptions.list({
        status,
        limit: 100,
        starting_after: startingAfter,
      })

      count += response.data.length
      hasMore = response.has_more
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id
      }
    }

    counts[status] = count
  }

  return counts
}

async function getSubscriptionsWithMissingPaymentMethod() {
  const problematic = []

  for (const status of ['past_due', 'trialing']) {
    let hasMore = true
    let startingAfter

    while (hasMore) {
      const response = await stripe.subscriptions.list({
        status,
        limit: 100,
        starting_after: startingAfter,
      })

      for (const sub of response.data) {
        if (!sub.default_payment_method) {
          const customer =
            typeof sub.customer === 'string'
              ? await stripe.customers.retrieve(sub.customer)
              : sub.customer

          if (customer.deleted) continue

          problematic.push({
            id: sub.id,
            status: sub.status,
            customer_email: customer.email,
            customer_name: customer.name,
            created: new Date(sub.created * 1000).toISOString(),
            current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
            trial_end: sub.trial_end
              ? new Date(sub.trial_end * 1000).toISOString()
              : null,
            metadata: sub.metadata,
          })
        }
      }

      hasMore = response.has_more
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id
      }
    }
  }

  return problematic
}

async function getRecentlyExpired(daysBack = 90) {
  const cutoff = Math.floor((Date.now() - daysBack * 24 * 60 * 60 * 1000) / 1000)
  const expired = []

  // incomplete_expired
  const incompleteExpired = await stripe.subscriptions.list({
    status: 'incomplete_expired',
    limit: 100,
  })

  for (const sub of incompleteExpired.data) {
    if (sub.created >= cutoff) {
      expired.push({
        id: sub.id,
        status: sub.status,
        created: new Date(sub.created * 1000).toISOString(),
        type: 'incomplete_expired',
      })
    }
  }

  // canceled recently
  let hasMore = true
  let startingAfter

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      status: 'canceled',
      limit: 100,
      starting_after: startingAfter,
    })

    for (const sub of response.data) {
      const endedAt = sub.ended_at || sub.canceled_at
      if (endedAt && endedAt >= cutoff) {
        expired.push({
          id: sub.id,
          status: sub.status,
          ended_at: new Date(endedAt * 1000).toISOString(),
          type: 'canceled',
        })
      }
    }

    hasMore = response.has_more
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return expired
}

async function testCouponValidation() {
  console.log('Testing coupon validation...')

  const testCodes = ['WELCOMEBACK30', 'V1_UPGRADE_35', 'INVALID_CODE']

  for (const code of testCodes) {
    try {
      const coupon = await stripe.coupons.retrieve(code)
      console.log(`  ✓ ${code}: valid (${coupon.percent_off}% off)`)
    } catch (err) {
      if (err.code === 'resource_missing') {
        console.log(`  ✗ ${code}: not found`)
      } else {
        console.log(`  ✗ ${code}: error - ${err.message}`)
      }
    }
  }
}

async function main() {
  console.log('=== Subscription State Analysis ===\n')

  // count by status
  console.log('Subscription counts by status:')
  const counts = await countSubscriptionsByStatus()
  for (const [status, count] of Object.entries(counts)) {
    console.log(`  ${status}: ${count}`)
  }
  console.log()

  // check for missing payment methods
  console.log('Subscriptions without payment method (past_due/trialing):')
  const problematic = await getSubscriptionsWithMissingPaymentMethod()
  if (problematic.length === 0) {
    console.log('  None found!')
  } else {
    console.log(`  Found ${problematic.length}:`)
    for (const sub of problematic.slice(0, 5)) {
      console.log(`    - ${sub.id} (${sub.status}): ${sub.customer_email}`)
    }
    if (problematic.length > 5) {
      console.log(`    ... and ${problematic.length - 5} more`)
    }
  }
  console.log()

  // check recently expired
  console.log('Recently expired (last 90 days):')
  const expired = await getRecentlyExpired()
  console.log(`  Found ${expired.length} expired subscriptions`)
  if (expired.length > 0) {
    const byType = expired.reduce((acc, e) => {
      acc[e.type] = (acc[e.type] || 0) + 1
      return acc
    }, {})
    for (const [type, count] of Object.entries(byType)) {
      console.log(`    ${type}: ${count}`)
    }
  }
  console.log()

  // test coupons
  await testCouponValidation()
  console.log()

  console.log('=== Done ===')
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
