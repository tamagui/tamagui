// @ts-check

import Stripe from 'stripe'
import * as postmark from 'postmark'
import * as dotenv from 'dotenv'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const POSTMARK_TOKEN = process.env.POSTMARK_SERVER_TOKEN
if (!POSTMARK_TOKEN) {
  throw new Error('POSTMARK_SERVER_TOKEN is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Student Discount',
    version: '0.1.0',
  },
})

const postmarkClient = new postmark.ServerClient(POSTMARK_TOKEN)

// Generate a unique code like STU followed by random alphanumeric
function generateUniqueCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = 'STU'
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

async function getOrCreateStudentCoupon() {
  // Look for existing 60% off student coupon
  const coupons = await stripe.coupons.list({ limit: 100 })
  let coupon = coupons.data.find(
    (c) => c.name === 'Student Discount 60%' && c.percent_off === 60 && c.valid
  )

  if (!coupon) {
    console.info('Creating new 60% student discount coupon...')
    coupon = await stripe.coupons.create({
      name: 'Student Discount 60%',
      percent_off: 60,
      duration: 'forever', // Applies to the lifetime of the subscription
    })
    console.info(`Created coupon: ${coupon.id}`)
  } else {
    console.info(`Using existing coupon: ${coupon.id}`)
  }

  return coupon
}

async function createPromotionCode(couponId) {
  const code = generateUniqueCode()

  const promotionCode = await stripe.promotionCodes.create({
    coupon: couponId,
    code: code,
    max_redemptions: 1, // One-time use
  })

  console.info(`Created promotion code: ${promotionCode.code}`)
  return promotionCode
}

function sendStudentDiscountEmail(email, couponCode) {
  const htmlBody = `
<!DOCTYPE html>
<html>
<body>
  <h1>Student Discount for Tamagui Pro</h1>

  <p>Thank you for your interest in Tamagui! We're happy to offer you a student discount.</p>

  <h2>Your Exclusive 60% Off Coupon</h2>

  <p style="font-size: 24px; font-weight: bold; background: #f0f0f0; padding: 20px; text-align: center; font-family: monospace;">
    ${couponCode}
  </p>

  <p>This coupon gives you <strong>60% off</strong> any Tamagui Pro product. It's a one-time use code just for you.</p>

  <h2>How to Use</h2>

  <ol>
    <li>Go to <a href="https://tamagui.dev/pro">tamagui.dev/pro</a></li>
    <li>Choose your preferred plan</li>
    <li>Enter the coupon code at checkout</li>
  </ol>

  <p>If you have any questions, feel free to reach out to us at <a href="mailto:support@tamagui.dev">support@tamagui.dev</a>.</p>

  <p>Best of luck with your studies!
    <br>The Tamagui Team</p>
</body>
</html>
  `.trim()

  return postmarkClient.sendEmail({
    From: 'support@tamagui.dev',
    To: email,
    Subject: 'Your Tamagui Student Discount (60% Off)',
    HtmlBody: htmlBody,
  })
}

async function sendStudentDiscount(email) {
  if (!email) {
    throw new Error('Email is required')
  }

  console.info(`Sending student discount to: ${email}`)

  // Get or create the base coupon
  const coupon = await getOrCreateStudentCoupon()

  // Create a unique one-time promotion code
  const promotionCode = await createPromotionCode(coupon.id)

  // Send the email
  console.info(`Sending email to ${email}...`)
  await sendStudentDiscountEmail(email, promotionCode.code)

  console.info(`\n✓ Success!`)
  console.info(`  Email: ${email}`)
  console.info(`  Coupon Code: ${promotionCode.code}`)
  console.info(`  Discount: 60% off`)
  console.info(`  Max Redemptions: 1`)
}

const email = process.argv[2]
if (!email) {
  console.error('Usage: node send-student-discount.mjs <email>')
  console.error('Example: node send-student-discount.mjs student@example.com')
  process.exit(1)
}

sendStudentDiscount(email).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
