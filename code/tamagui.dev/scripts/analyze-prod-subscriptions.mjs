#!/usr/bin/env node
// @ts-check

/**
 * Analyze Production Subscriptions (READ-ONLY)
 *
 * Analyzes production subscription states to identify issues.
 * This script is READ-ONLY and makes no changes.
 *
 * Usage:
 *   node scripts/analyze-prod-subscriptions.mjs [--verbose]
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
    name: 'Tamagui Subscription Analysis',
    version: '0.1.0',
  },
})

const verbose = process.argv.includes('--verbose')

console.log('=== Production Subscription Analysis (READ-ONLY) ===\n')

async function getSubscriptionsByStatus(status) {
  const subs = []
  let hasMore = true
  let startingAfter

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      status,
      limit: 100,
      starting_after: startingAfter,
    })

    subs.push(...response.data)
    hasMore = response.has_more
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return subs
}

async function analyzePastDue() {
  console.log('Analyzing past_due subscriptions...')
  const pastDue = await getSubscriptionsByStatus('past_due')

  const migratedWithoutPayment = pastDue.filter(
    (sub) => sub.metadata?.migrated_from && !sub.default_payment_method
  )

  console.log(`  Total past_due: ${pastDue.length}`)
  console.log(`  Migrated without payment method: ${migratedWithoutPayment.length}`)

  if (verbose && migratedWithoutPayment.length > 0) {
    console.log('\n  Sample past_due migrated subscriptions:')
    for (const sub of migratedWithoutPayment.slice(0, 3)) {
      console.log(`    ${sub.id}: ${sub.metadata.migrated_from}`)
    }
  }

  return { total: pastDue.length, migrated: migratedWithoutPayment.length }
}

async function analyzeTrialing() {
  console.log('\nAnalyzing trialing subscriptions...')
  const trialing = await getSubscriptionsByStatus('trialing')

  const now = Date.now()
  const noPaymentMethod = []
  const expiringSoon = []

  for (const sub of trialing) {
    if (!sub.default_payment_method) {
      noPaymentMethod.push(sub)
    }

    if (sub.trial_end) {
      const daysUntil = Math.ceil((sub.trial_end * 1000 - now) / (1000 * 60 * 60 * 24))
      if (daysUntil <= 14) {
        expiringSoon.push({ sub, daysUntil })
      }
    }
  }

  console.log(`  Total trialing: ${trialing.length}`)
  console.log(`  Without payment method: ${noPaymentMethod.length}`)
  console.log(`  Expiring within 14 days: ${expiringSoon.length}`)

  if (verbose && expiringSoon.length > 0) {
    console.log('\n  Subscriptions expiring soon:')
    for (const { sub, daysUntil } of expiringSoon.slice(0, 5)) {
      console.log(`    ${sub.id}: ${daysUntil} days`)
    }
  }

  return {
    total: trialing.length,
    noPaymentMethod: noPaymentMethod.length,
    expiringSoon: expiringSoon.length,
  }
}

async function analyzeExpired() {
  console.log('\nAnalyzing recently expired subscriptions...')

  const cutoff = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000)

  // incomplete_expired
  const incompleteExpired = await getSubscriptionsByStatus('incomplete_expired')
  const recentIncomplete = incompleteExpired.filter((sub) => sub.created >= cutoff)

  // canceled
  const canceled = await getSubscriptionsByStatus('canceled')
  const recentCanceled = canceled.filter((sub) => {
    const endedAt = sub.ended_at || sub.canceled_at
    return endedAt && endedAt >= cutoff
  })

  console.log(`  Total incomplete_expired: ${incompleteExpired.length}`)
  console.log(`  Recent incomplete_expired (90d): ${recentIncomplete.length}`)
  console.log(`  Total canceled: ${canceled.length}`)
  console.log(`  Recent canceled (90d): ${recentCanceled.length}`)

  // analyze reasons for cancellation
  if (verbose && recentCanceled.length > 0) {
    const reasons = {}
    for (const sub of recentCanceled) {
      const reason = sub.cancellation_details?.reason || 'unknown'
      reasons[reason] = (reasons[reason] || 0) + 1
    }
    console.log('\n  Cancellation reasons:')
    for (const [reason, count] of Object.entries(reasons)) {
      console.log(`    ${reason}: ${count}`)
    }
  }

  return {
    incompleteExpired: recentIncomplete.length,
    canceled: recentCanceled.length,
  }
}

async function checkCoupons() {
  console.log('\nChecking coupons...')

  const codes = ['WELCOMEBACK30', 'V1_UPGRADE_35', 'TAMAGUI_PRO_RENEWAL', 'RENEWAL04']

  for (const code of codes) {
    try {
      const coupon = await stripe.coupons.retrieve(code)
      const discount = coupon.percent_off
        ? `${coupon.percent_off}% off`
        : `$${(coupon.amount_off || 0) / 100} off`
      console.log(`  ✓ ${code}: ${discount}, ${coupon.times_redeemed || 0} redeemed`)
    } catch (err) {
      console.log(`  ✗ ${code}: not found`)
    }
  }
}

async function analyzeActiveSubscriptions() {
  console.log('\nAnalyzing active subscriptions...')
  const active = await getSubscriptionsByStatus('active')

  const byProduct = {}
  let v1Count = 0
  let v2Count = 0

  for (const sub of active) {
    for (const item of sub.items?.data || []) {
      const productId = item.price?.product
      if (productId) {
        byProduct[productId] = (byProduct[productId] || 0) + 1
      }

      // crude V1 vs V2 detection based on product naming
      const productName = item.price?.nickname || ''
      if (productName.includes('V2') || productName.includes('v2')) {
        v2Count++
      } else {
        v1Count++
      }
    }
  }

  console.log(`  Total active: ${active.length}`)
  console.log(`  Approximate V1: ${v1Count}`)
  console.log(`  Approximate V2: ${v2Count}`)

  // check for subscriptions expiring soon (for renewal emails)
  const now = Date.now()
  const expiringSoon = active.filter((sub) => {
    const endDate = sub.current_period_end * 1000
    const daysUntil = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24))
    return daysUntil <= 30
  })

  console.log(`  Expiring in 30 days: ${expiringSoon.length}`)

  return {
    total: active.length,
    expiringSoon: expiringSoon.length,
  }
}

async function main() {
  const pastDue = await analyzePastDue()
  const trialing = await analyzeTrialing()
  const expired = await analyzeExpired()
  const active = await analyzeActiveSubscriptions()

  await checkCoupons()

  console.log('\n' + '='.repeat(50))
  console.log('SUMMARY')
  console.log('='.repeat(50))

  const issues = []

  if (pastDue.migrated > 0) {
    issues.push(`${pastDue.migrated} past_due migrated subscriptions need attention`)
  }

  if (trialing.noPaymentMethod > 0) {
    issues.push(`${trialing.noPaymentMethod} trialing subs without payment method`)
  }

  if (expired.incompleteExpired + expired.canceled > 0) {
    issues.push(
      `${expired.incompleteExpired + expired.canceled} recently expired (potential re-engagement)`
    )
  }

  if (issues.length === 0) {
    console.log('No immediate issues detected!')
  } else {
    console.log('Issues to address:')
    for (const issue of issues) {
      console.log(`  • ${issue}`)
    }
  }

  console.log('\n=== Done ===')
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
