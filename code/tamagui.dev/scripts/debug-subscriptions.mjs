// @ts-check

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** @typedef {import('../features/supabase/types').Database} Database */

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Subscription Debug',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL} with key? ${!!SUPA_KEY}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

const OLD_PRODUCT_IDS = ['prod_NzLEazaqBgoKnC', 'prod_PT7X4Dse6jhTVL']
const DEBUG_LOG_FILE = join(process.cwd(), 'subscription_debug_logs.json')

/**
 * Debug function to get all relevant subscriptions
 */
async function debugSubscriptions() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const oneWeekAgoUnix = Math.floor(oneWeekAgo.getTime() / 1000)

  console.info('1. Fetching Supabase subscriptions...')
  const { data: supabaseSubscriptions, error } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      subscription_items(
        *,
        prices(
          *,
          products(*)
        )
      )
    `)
    .or(
      `status.eq.active,status.eq.trialing,and(canceled_at.gt.${oneWeekAgo.toISOString()},cancel_at_period_end.eq.true)`
    )

  if (error) {
    console.error('Supabase fetch error:', error)
    throw error
  }

  console.info('2. Fetching basic Stripe subscription data...')
  const stripeSubscriptions = await stripe.subscriptions.list({
    limit: 100,
    status: 'canceled',
    created: {
      gte: oneWeekAgoUnix,
    },
  })

  console.info('3. Fetching detailed Stripe data for each subscription...')
  const expandedStripeSubscriptions = await Promise.all(
    stripeSubscriptions.data.map(async (sub) => {
      console.info(`  Processing Stripe subscription: ${sub.id}`)
      try {
        const subWithCustomer = await stripe.subscriptions.retrieve(sub.id, {
          expand: ['customer'],
        })

        const items = await Promise.all(
          sub.items.data.map(async (item) => {
            const expandedItem = await stripe.subscriptionItems.retrieve(item.id, {
              expand: ['price', 'price.product'],
            })
            return expandedItem
          })
        )

        return {
          ...subWithCustomer,
          items: { data: items },
        }
      } catch (err) {
        console.error(`  Error processing subscription ${sub.id}:`, err)
        return null
      }
    })
  )

  console.info('4. Processing and filtering Stripe subscriptions...')
  const validExpandedSubscriptions = expandedStripeSubscriptions.filter(Boolean)

  const deletedSubscriptions = validExpandedSubscriptions
    .filter((sub) =>
      sub.items.data.some((item) => {
        const product = item.price?.product
        return (
          product && typeof product === 'object' && OLD_PRODUCT_IDS.includes(product.id)
        )
      })
    )
    .map((sub) => ({
      id: sub.id,
      status: sub.status,
      user_id: typeof sub.customer === 'string' ? sub.customer : sub.customer.id,
      subscription_items: sub.items.data.map((item) => ({
        id: item.id,
        subscription_id: sub.id,
        price_id: item.price?.id,
        prices: item.price && {
          id: item.price.id,
          active: true,
          currency: item.price.currency,
          interval: item.price.recurring?.interval || null,
          interval_count: item.price.recurring?.interval_count || null,
          description: item.price.nickname || null,
          metadata: item.price.metadata || {},
          product_id:
            typeof item.price.product === 'string'
              ? item.price.product
              : item.price.product.id,
          trial_period_days: item.price.recurring?.trial_period_days || null,
          type: item.price.type,
          unit_amount: item.price.unit_amount,
          products:
            item.price.product && typeof item.price.product === 'object'
              ? {
                  id: item.price.product.id,
                  name: item.price.product.name || null,
                  active: item.price.product.active || null,
                  description: item.price.product.description || null,
                  image: (item.price.product.images || [])[0] || null,
                  metadata: item.price.product.metadata || {},
                }
              : null,
        },
      })),
      metadata: sub.metadata,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      current_period_start: new Date(sub.current_period_start * 1000).toISOString(),
      cancel_at: sub.cancel_at ? new Date(sub.cancel_at * 1000).toISOString() : null,
      canceled_at: sub.canceled_at
        ? new Date(sub.canceled_at * 1000).toISOString()
        : null,
      created: new Date(sub.created * 1000).toISOString(),
      ended_at: sub.ended_at ? new Date(sub.ended_at * 1000).toISOString() : null,
      trial_end: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
      trial_start: sub.trial_start
        ? new Date(sub.trial_start * 1000).toISOString()
        : null,
      cancel_at_period_end: sub.cancel_at_period_end,
      quantity: sub.items.data[0]?.quantity || null,
    }))

  console.info('5. Combining and deduplicating subscriptions...')
  const supabaseSubs = supabaseSubscriptions.filter((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.prices?.products?.id && OLD_PRODUCT_IDS.includes(item.prices.products.id)
    )
  )

  const allSubscriptions = [...supabaseSubs]

  for (const deletedSub of deletedSubscriptions) {
    if (!allSubscriptions.some((sub) => sub.id === deletedSub.id)) {
      allSubscriptions.push(deletedSub)
    }
  }

  const debugLog = {
    timestamp: new Date().toISOString(),
    supabase_subscriptions_count: supabaseSubs.length,
    stripe_deleted_subscriptions_count: deletedSubscriptions.length,
    total_unique_subscriptions: allSubscriptions.length,
    supabase_subscriptions: supabaseSubs,
    stripe_deleted_subscriptions: deletedSubscriptions,
    all_subscriptions: allSubscriptions,
    old_product_ids: OLD_PRODUCT_IDS,
    summary: {
      supabase_subscription_statuses: countStatuses(supabaseSubs),
      stripe_subscription_statuses: countStatuses(deletedSubscriptions),
      products_found: countProducts(allSubscriptions),
    },
  }

  await writeFile(DEBUG_LOG_FILE, JSON.stringify(debugLog, null, 2))

  console.info('\nSubscription Summary:')
  console.info(`Found ${supabaseSubs.length} active/cancelled subscriptions in Supabase`)
  console.info(`Found ${deletedSubscriptions.length} deleted subscriptions in Stripe`)
  console.info(`Total unique subscriptions to migrate: ${allSubscriptions.length}`)
  console.info(`Debug log written to: ${DEBUG_LOG_FILE}`)
  console.info('\nStatus Breakdown:')
  console.info('Supabase:', debugLog.summary.supabase_subscription_statuses)
  console.info('Stripe:', debugLog.summary.stripe_subscription_statuses)
  console.info('\nProducts Found:', debugLog.summary.products_found)

  return debugLog
}

// Helper function to count subscription statuses
function countStatuses(subscriptions) {
  return subscriptions.reduce((acc, sub) => {
    acc[sub.status] = (acc[sub.status] || 0) + 1
    return acc
  }, {})
}

// Helper function to count products
function countProducts(subscriptions) {
  const products = new Set()
  subscriptions.forEach((sub) => {
    sub.subscription_items?.forEach((item) => {
      if (item.prices?.products?.id) {
        products.add(item.prices.products.id)
      }
    })
  })
  return Array.from(products)
}

// Execute the debug function
debugSubscriptions().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
