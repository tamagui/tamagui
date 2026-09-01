// @ts-check

/**
 * Grant one free year of the current V2 Pro license to an existing user.
 *
 * This creates a zero-dollar, one-time Stripe invoice for the V2 license. The
 * normal invoice.paid webhook then records one year of Pro access in Supabase.
 * No recurring Stripe subscription is created, so the gift cannot renew.
 *
 * Usage:
 *   node scripts/grant-free-subscription.mjs <email>
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
    name: 'Tamagui Free Pro Year Granter',
    version: '1.0.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

const PRO_V2_LICENSE_PRICE_ID = 'price_1T4OsOFQGtHoG6xcBAL0yFd1'
const GIFT_COUPON_ID = 'TAMAGUI_PRO_YEAR_GIFT'
const GIFT_REASON = 'free-pro-year-gift'

const sleep = (milliseconds) =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds)
  })

async function getUserByEmail(email) {
  const { data, error } = await supabaseAdmin
    .from('users_private')
    .select('id, email, github_user_name')
    .ilike('email', email)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to find user with email "${email}": ${error.message}`)
  }
  if (!data) {
    throw new Error(`No Tamagui account found for ${email}`)
  }
  return data
}

async function getOrCreateStripeCustomer(userId, email) {
  const { data: existingCustomer, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw new Error(`Failed to look up Stripe customer: ${error.message}`)

  if (existingCustomer?.stripe_customer_id) {
    return existingCustomer.stripe_customer_id
  }

  const customer = await stripe.customers.create(
    {
      email,
      metadata: {
        supabaseUUID: userId,
      },
    },
    {
      idempotencyKey: `gift_customer_${userId}`,
    }
  )

  const { error: saveError } = await supabaseAdmin.from('customers').upsert({
    id: userId,
    stripe_customer_id: customer.id,
  })

  if (saveError) throw new Error(`Failed to save Stripe customer: ${saveError.message}`)
  return customer.id
}

async function getOrCreateGiftCoupon() {
  try {
    const coupon = await stripe.coupons.retrieve(GIFT_COUPON_ID)
    if ('deleted' in coupon && coupon.deleted) {
      throw new Error(`Stripe coupon ${GIFT_COUPON_ID} was deleted`)
    }
    if (coupon.percent_off !== 100 || coupon.duration !== 'once') {
      throw new Error(`Stripe coupon ${GIFT_COUPON_ID} has unexpected terms`)
    }
    return coupon.id
  } catch (error) {
    if (error instanceof Error && error.message.includes('has unexpected terms')) {
      throw error
    }
    if (error instanceof Error && error.message.includes('was deleted')) {
      throw error
    }
    if (
      !(error instanceof Stripe.errors.StripeError) ||
      error.code !== 'resource_missing'
    ) {
      throw error
    }

    const coupon = await stripe.coupons.create({
      id: GIFT_COUPON_ID,
      percent_off: 100,
      duration: 'once',
      name: 'Tamagui Pro one-year gift',
      metadata: {
        reason: GIFT_REASON,
      },
    })
    return coupon.id
  }
}

async function findExistingGiftInvoice(stripeCustomerId, userId) {
  const invoices = await stripe.invoices.list({
    customer: stripeCustomerId,
    limit: 100,
  })

  return (
    invoices.data.find(
      (invoice) =>
        invoice.metadata?.gift_user_id === userId &&
        invoice.metadata?.gift_reason === GIFT_REASON
    ) ?? null
  )
}

async function getActiveSubscriptions(userId) {
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select('id, status, current_period_end')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])

  if (error) throw new Error(`Failed to check existing access: ${error.message}`)
  return data ?? []
}

async function waitForSyncedSubscription(userId, invoiceId) {
  for (let attempt = 0; attempt < 12; attempt++) {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status, current_period_end, cancel_at, cancel_at_period_end')
      .eq('id', invoiceId)
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw new Error(`Failed to verify gifted access: ${error.message}`)
    if (data?.status === 'active') return data
    await sleep(2_500)
  }

  throw new Error(
    `Stripe invoice ${invoiceId} is paid, but the invoice.paid webhook has not synced it yet`
  )
}

async function grantFreeProYear(email) {
  const user = await getUserByEmail(email)
  const normalizedEmail = user.email || email
  const stripeCustomerId = await getOrCreateStripeCustomer(user.id, normalizedEmail)
  let invoice = await findExistingGiftInvoice(stripeCustomerId, user.id)

  if (invoice?.status === 'paid') {
    const syncedSubscription = await waitForSyncedSubscription(user.id, invoice.id)
    console.info(
      JSON.stringify({
        email: normalizedEmail,
        stripeInvoiceId: invoice.id,
        status: syncedSubscription.status,
        accessUntil: syncedSubscription.current_period_end,
        autoRenew: false,
        alreadyGranted: true,
      })
    )
    return
  }

  const activeSubscriptions = await getActiveSubscriptions(user.id)
  if (activeSubscriptions.length > 0) {
    throw new Error(
      `User already has active Pro access: ${activeSubscriptions.map((subscription) => subscription.id).join(', ')}`
    )
  }

  const couponId = await getOrCreateGiftCoupon()

  if (!invoice) {
    await stripe.invoiceItems.create(
      {
        customer: stripeCustomerId,
        price: PRO_V2_LICENSE_PRICE_ID,
        metadata: {
          gift_user_id: user.id,
          gift_reason: GIFT_REASON,
          version: 'v2',
        },
      },
      {
        idempotencyKey: `gift_invoice_item_${user.id}`,
      }
    )

    invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: false,
        discounts: [{ coupon: couponId }],
        metadata: {
          gift_user_id: user.id,
          gift_reason: GIFT_REASON,
          version: 'v2',
          type: 'pro_v2_gift',
        },
      },
      {
        idempotencyKey: `gift_invoice_${user.id}`,
      }
    )
  }

  if (invoice.status === 'draft') {
    invoice = await stripe.invoices.finalizeInvoice(invoice.id)
  }
  if (invoice.status !== 'paid') {
    invoice = await stripe.invoices.pay(invoice.id)
  }
  if (invoice.status !== 'paid') {
    throw new Error(`Gift invoice ${invoice.id} did not become paid: ${invoice.status}`)
  }

  const syncedSubscription = await waitForSyncedSubscription(user.id, invoice.id)

  console.info(
    JSON.stringify({
      email: normalizedEmail,
      stripeInvoiceId: invoice.id,
      status: syncedSubscription.status,
      accessUntil: syncedSubscription.current_period_end,
      autoRenew: false,
    })
  )
}

const email = process.argv[2]?.trim().toLowerCase()
if (!email || !email.includes('@')) {
  console.error('Usage: node scripts/grant-free-subscription.mjs <email>')
  process.exit(1)
}

grantFreeProYear(email).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
