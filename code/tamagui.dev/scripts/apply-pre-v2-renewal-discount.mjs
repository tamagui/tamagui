#!/usr/bin/env node

import Stripe from 'stripe'
import dotenv from 'dotenv'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY

if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Renewal Discount Backfill',
    version: '0.1.0',
  },
})

const COUPON_ID = 'PRE_V2_RENEWAL_30'
const PROMO_CODE = 'RENEWAL30'

const V1_PRODUCTS = new Set([
  'prod_RlRd2DVrG0frHe',
  'prod_Rxu0x7jR0nWJSv',
  'prod_RlRebXO307MLoH',
  'prod_RlRdUMAas8elvJ',
])

const V2_PRODUCTS = new Set([
  'prod_TneqayKPO32G63',
  'prod_TsDjQ6tmdFy7M6',
  'prod_TsDjG5QpL21tT1',
])

const shouldApply = process.argv.includes('--apply')

async function ensureCoupon() {
  try {
    const coupon = await stripe.coupons.retrieve(COUPON_ID)
    return coupon
  } catch (err) {
    if (!shouldApply) {
      throw new Error(
        `Coupon ${COUPON_ID} does not exist. Re-run with --apply to create it.`
      )
    }

    return stripe.coupons.create({
      id: COUPON_ID,
      percent_off: 30,
      duration: 'forever',
      name: 'Pre-V2 Renewal 30%',
      metadata: {
        source: 'apply-pre-v2-renewal-discount.mjs',
      },
    })
  }
}

async function ensurePromoCode(couponId) {
  const promos = await stripe.promotionCodes.list({
    code: PROMO_CODE,
    active: true,
    limit: 10,
  })

  const existing = promos.data.find(
    (promo) => typeof promo.coupon === 'string' && promo.coupon === couponId
  )

  if (existing) {
    return existing
  }

  if (!shouldApply) {
    throw new Error(
      `Promotion code ${PROMO_CODE} does not exist for coupon ${couponId}. Re-run with --apply to create it.`
    )
  }

  return stripe.promotionCodes.create({
    coupon: couponId,
    code: PROMO_CODE,
    metadata: {
      source: 'apply-pre-v2-renewal-discount.mjs',
    },
  })
}

async function listEligibleSubscriptions() {
  const eligible = []
  let startingAfter

  while (true) {
    const page = await stripe.subscriptions.list({
      status: 'active',
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.discount.coupon'],
    })

    for (const sub of page.data) {
      const productIds = sub.items.data.map((item) => item.price?.product).filter(Boolean)
      const isV1 = productIds.some((id) => V1_PRODUCTS.has(id))
      const isV2 = productIds.some((id) => V2_PRODUCTS.has(id))

      if (!isV1 || isV2) continue

      const coupon =
        sub.discount?.coupon && typeof sub.discount.coupon !== 'string'
          ? sub.discount.coupon
          : null
      const percentOff = coupon?.percent_off ?? null

      if (percentOff === null || percentOff < 30) {
        eligible.push({
          id: sub.id,
          currentPercentOff: percentOff,
          currentCouponId: coupon?.id ?? null,
        })
      }
    }

    if (!page.has_more || page.data.length === 0) break
    startingAfter = page.data[page.data.length - 1].id
  }

  return eligible
}

async function applyCoupon(subscriptionId) {
  return stripe.subscriptions.update(subscriptionId, {
    coupon: COUPON_ID,
    proration_behavior: 'none',
  })
}

async function main() {
  console.log(`Mode: ${shouldApply ? 'APPLY' : 'DRY RUN'}`)

  const coupon = await ensureCoupon()
  console.log(`Coupon: ${coupon.id} (${coupon.percent_off}% ${coupon.duration})`)

  const promo = await ensurePromoCode(coupon.id)
  console.log(`Promotion code: ${promo.code}`)

  const eligible = await listEligibleSubscriptions()

  console.log(`Eligible subscriptions: ${eligible.length}`)
  console.log(`Sample: ${JSON.stringify(eligible.slice(0, 10), null, 2)}`)

  if (!shouldApply) {
    return
  }

  let updated = 0
  const failures = []

  for (const sub of eligible) {
    try {
      await applyCoupon(sub.id)
      updated++
      if (updated % 25 === 0) {
        console.log(`Updated ${updated}/${eligible.length}`)
      }
    } catch (err) {
      failures.push({
        id: sub.id,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  console.log(
    JSON.stringify(
      {
        updated,
        failed: failures.length,
        failures: failures.slice(0, 20),
      },
      null,
      2
    )
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
