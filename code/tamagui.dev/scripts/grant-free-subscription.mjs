// @ts-check

/**
 * Grant Free Subscription Script
 *
 * Creates a free Pro subscription for a user via Stripe with a 100% coupon.
 * The webhook will automatically sync to Supabase.
 *
 * Usage:
 *   node scripts/grant-free-subscription.mjs <github_username>
 *
 * Example:
 *   node scripts/grant-free-subscription.mjs DaveyEke
 */

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Free Subscription Granter',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL}`)

const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

// V1 Pro subscription price (recurring $240/year - will be $0 with 100% coupon)
const PRO_PRICE_ID = 'price_1QthHSFQGtHoG6xcDOEuFsrW'

async function getUserByGitHubUsername(githubUsername) {
  const { data, error } = await supabaseAdmin
    .from('users_private')
    .select('*')
    .ilike('github_user_name', githubUsername)
    .single()

  if (error) {
    throw new Error(
      `Failed to find user with GitHub username "${githubUsername}": ${error.message}`
    )
  }
  return data
}

async function getOrCreateStripeCustomer(userId, email) {
  // check if customer exists
  const { data: existingCustomer } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single()

  if (existingCustomer?.stripe_customer_id) {
    console.info(`Found existing Stripe customer: ${existingCustomer.stripe_customer_id}`)
    return existingCustomer.stripe_customer_id
  }

  // create new customer in Stripe
  const customer = await stripe.customers.create({
    email,
    metadata: {
      supabaseUUID: userId,
    },
  })

  // save to supabase
  await supabaseAdmin.from('customers').upsert({
    id: userId,
    stripe_customer_id: customer.id,
  })

  console.info(`Created new Stripe customer: ${customer.id}`)
  return customer.id
}

async function getOrCreateFreeCoupon() {
  const couponId = 'FREE_PRO_100_PERCENT'

  try {
    const existingCoupon = await stripe.coupons.retrieve(couponId)
    console.info(`Using existing coupon: ${couponId}`)
    return existingCoupon.id
  } catch {
    // coupon doesn't exist, create it
    const coupon = await stripe.coupons.create({
      id: couponId,
      percent_off: 100,
      duration: 'forever',
      name: 'Free Pro (100% off)',
    })
    console.info(`Created new coupon: ${coupon.id}`)
    return coupon.id
  }
}

async function grantFreeSubscription(githubUsername) {
  console.info(`\n=== Granting Free Pro Subscription ===\n`)
  console.info(`GitHub username: ${githubUsername}`)

  // 1. find user
  console.info('\n1. Finding user...')
  const userPrivate = await getUserByGitHubUsername(githubUsername)
  console.info(`   Found user: ${userPrivate.id}`)

  // get user email from auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(
    userPrivate.id
  )
  if (authError) throw new Error(`Failed to get user: ${authError.message}`)
  console.info(`   Email: ${authUser.user.email}`)

  // 2. check for existing active subscription
  console.info('\n2. Checking existing subscriptions...')
  const { data: existingSubs } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userPrivate.id)
    .in('status', ['active', 'trialing'])

  if (existingSubs && existingSubs.length > 0) {
    console.info(`   User already has ${existingSubs.length} active subscription(s)!`)
    console.info(`   Subscription IDs: ${existingSubs.map((s) => s.id).join(', ')}`)
    console.info(`   Aborting - user already has Pro access.`)
    return
  }
  console.info(`   No active subscriptions found.`)

  // 3. get or create stripe customer
  console.info('\n3. Setting up Stripe customer...')
  const stripeCustomerId = await getOrCreateStripeCustomer(
    userPrivate.id,
    authUser.user.email
  )

  // 4. get or create 100% coupon
  console.info('\n4. Getting/creating 100% coupon...')
  const couponId = await getOrCreateFreeCoupon()

  // 5. create subscription with coupon
  console.info('\n5. Creating free subscription...')
  const subscription = await stripe.subscriptions.create({
    customer: stripeCustomerId,
    items: [{ price: PRO_PRICE_ID }],
    coupon: couponId,
    metadata: {
      supabaseUUID: userPrivate.id,
      grantedBy: 'admin-script',
      reason: 'free-pro-grant',
    },
  })

  console.info(`   Created subscription: ${subscription.id}`)
  console.info(`   Status: ${subscription.status}`)

  console.info('\n=== Done! ===')
  console.info(`\nThe Stripe webhook will sync this to Supabase automatically.`)
  console.info(`User @${githubUsername} now has Pro access!`)
}

const githubUsername = process.argv[2]
if (!githubUsername) {
  console.error('Please provide a GitHub username as an argument')
  console.error('Usage: node scripts/grant-free-subscription.mjs <github_username>')
  process.exit(1)
}

grantFreeSubscription(githubUsername).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
