#!/usr/bin/env node

/**
 * Creates the DEV_TEST_99 coupon for developer testing
 * Run: node scripts/create-dev-test-coupon.mjs
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY env var must be set
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

async function createDevTestCoupon() {
  const couponCode = 'DEV_TEST_99'

  try {
    // check if coupon already exists
    const existingCoupons = await stripe.coupons.list({ limit: 100 })
    const exists = existingCoupons.data.find((c) => c.id === couponCode)

    if (exists) {
      console.log(`Coupon ${couponCode} already exists:`, exists)
      return exists
    }

    // create the coupon
    const coupon = await stripe.coupons.create({
      id: couponCode,
      percent_off: 99,
      duration: 'forever',
      name: 'Developer Test Coupon (99% off)',
      metadata: {
        purpose: 'developer_testing',
        created_by: 'create-dev-test-coupon.mjs',
      },
    })

    console.log(`Created coupon ${couponCode}:`, coupon)

    // also create a promotion code for the coupon (so it can be applied by code)
    const promoCode = await stripe.promotionCodes.create({
      coupon: couponCode,
      code: couponCode,
      active: true,
      metadata: {
        purpose: 'developer_testing',
      },
    })

    console.log(`Created promotion code:`, promoCode)

    return coupon
  } catch (error) {
    console.error('Error creating coupon:', error.message)
    throw error
  }
}

createDevTestCoupon()
  .then(() => {
    console.log('\nDone! Developers can now use DEV_TEST_99 coupon for testing.')
    console.log('To test: go to tamagui.dev?testPurchase=true and click Pro')
  })
  .catch((err) => {
    console.error('Failed:', err)
    process.exit(1)
  })
