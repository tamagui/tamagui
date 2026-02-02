#!/usr/bin/env node

/**
 * Check Stripe configuration to debug payment issues
 * Run: node scripts/check-stripe-config.mjs
 *
 * Prerequisites:
 * - STRIPE_SECRET_KEY env var must be set
 */

import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

// From products.ts
const EXPECTED_PRICES = {
  PRO_V2_LICENSE: 'price_1Sv5TSFQGtHoG6xcMB42xb7d',
  PRO_V2_UPGRADE: 'price_1Sv5TTFQGtHoG6xcm8GJ3Uhg',
  SUPPORT_DIRECT: 'price_1SuTIHFQGtHoG6xcSRnWg3xB',
  SUPPORT_SPONSOR: 'price_1SuTIVFQGtHoG6xcVVnbEeQx',
}

async function checkPrices() {
  console.log('=== Checking Price IDs ===\n')

  for (const [name, priceId] of Object.entries(EXPECTED_PRICES)) {
    try {
      const price = await stripe.prices.retrieve(priceId)
      console.log(`${name}:`)
      console.log(`  ID: ${price.id}`)
      console.log(`  Active: ${price.active}`)
      console.log(`  Amount: $${(price.unit_amount / 100).toFixed(2)} ${price.currency}`)
      console.log(`  Type: ${price.type}`)
      console.log(`  Product: ${price.product}`)
      console.log('')
    } catch (error) {
      console.log(`${name}: ERROR - ${error.message}`)
      console.log(`  Price ID: ${priceId}`)
      console.log('')
    }
  }
}

async function checkPaymentMethodDomains() {
  console.log('=== Checking Payment Method Domains ===\n')

  try {
    // Use raw API call since paymentMethodDomains might not be in the SDK
    const response = await fetch(
      'https://api.stripe.com/v1/payment_method_domains?limit=100',
      {
        headers: {
          Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      }
    )
    const domains = await response.json()

    if (domains.data.length === 0) {
      console.log('WARNING: No payment method domains registered!')
      console.log('This may cause "Unable to download payment manifest" errors')
      console.log('Run: node scripts/register-payment-domain.mjs')
    } else {
      for (const domain of domains.data) {
        const linkStatus = domain.link?.status || 'unknown'
        console.log(`${domain.domain_name}:`)
        console.log(`  Enabled: ${domain.enabled}`)
        console.log(`  Link Status: ${linkStatus}`)
        console.log('')
      }
    }
  } catch (error) {
    console.log(`Error checking domains: ${error.message}`)
  }
}

async function checkLinkSettings() {
  console.log('=== Checking Link Settings ===\n')

  try {
    // Check if Link is enabled in payment method settings
    const paymentMethodConfigs = await stripe.paymentMethodConfigurations?.list?.({
      limit: 10,
    })

    if (paymentMethodConfigs) {
      console.log('Payment method configurations found')
    } else {
      console.log('Could not retrieve payment method configurations')
      console.log('Check Link settings in Stripe Dashboard: Settings > Payment methods')
    }
  } catch (error) {
    // This API might not be available in older API versions
    console.log('Note: Link settings should be checked in Stripe Dashboard')
    console.log('Go to: Settings > Payment methods > Link')
  }
}

async function checkCoupons() {
  console.log('=== Checking Test Coupon ===\n')

  try {
    const coupon = await stripe.coupons.retrieve('DEV_TEST_99')
    console.log('DEV_TEST_99 coupon exists:')
    console.log(`  Percent off: ${coupon.percent_off}%`)
    console.log(`  Active: ${coupon.valid}`)
  } catch (error) {
    if (error.code === 'resource_missing') {
      console.log('DEV_TEST_99 coupon not found')
      console.log('Run: node scripts/create-dev-test-coupon.mjs')
    } else {
      console.log(`Error: ${error.message}`)
    }
  }
}

async function main() {
  console.log('=== Stripe Configuration Check ===\n')
  console.log(
    `API Mode: ${process.env.STRIPE_SECRET_KEY?.startsWith('sk_live') ? 'LIVE' : 'TEST'}\n`
  )

  await checkPrices()
  await checkPaymentMethodDomains()
  await checkLinkSettings()
  await checkCoupons()

  console.log('=== Done ===')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
