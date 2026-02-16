#!/usr/bin/env node
// @ts-check

/**
 * Test Coupon Validation API
 *
 * Tests the /api/validate-coupon endpoint to ensure coupons work correctly.
 *
 * Usage:
 *   node scripts/test-coupon-api.mjs [--prod]
 */

const isProd = process.argv.includes('--prod')
const baseUrl = isProd ? 'https://tamagui.dev' : 'http://localhost:5005'

const testCodes = ['WELCOMEBACK30', 'V1_UPGRADE_35', 'INVALID_CODE_123']

async function testCoupon(code) {
  try {
    const response = await fetch(`${baseUrl}/api/validate-coupon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
    const data = await response.json()

    if (data.valid) {
      const discount = data.coupon.percent_off
        ? `${data.coupon.percent_off}% off`
        : `$${data.coupon.amount_off / 100} off`
      console.log(`  ✓ ${code}: ${discount}`)
    } else {
      console.log(`  ✗ ${code}: ${data.message || 'invalid'}`)
    }
  } catch (err) {
    console.log(`  ✗ ${code}: error - ${err.message}`)
  }
}

async function main() {
  console.log(`Testing coupon validation API (${baseUrl})\n`)

  for (const code of testCodes) {
    await testCoupon(code)
  }

  console.log('\nDone!')
}

main().catch(console.error)
