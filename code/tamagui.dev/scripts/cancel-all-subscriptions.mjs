// @ts-check

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

/** @typedef {import('../features/supabase/types').Database} Database */

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Next.js Subscription Starter',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL} with key? ${!!SUPA_KEY}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
export const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

async function cancelAllSubscriptions() {
  // store successfully cancelled subscriptions
  /**
   * @type {string[]}
   */
  const cancelledSubscriptions = []

  try {
    // get all active subscriptions
    const { data: subscriptions, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id')
      .is('canceled_at', null)

    if (error) throw error

    console.info(`Found ${subscriptions.length} active subscriptions`)

    // cancel each subscription
    for (const sub of subscriptions) {
      try {
        await stripe.subscriptions.update(sub.id, {
          cancel_at_period_end: true,
        })
        cancelledSubscriptions.push(sub.id)
        console.info(`Cancelled subscription: ${sub.id}`)
      } catch (e) {
        console.error(`Failed to cancel subscription ${sub.id}:`, e)
        // if error, rollback all cancellations
        await rollbackCancellations(cancelledSubscriptions)
        throw e
      }
    }

    console.info('All subscriptions have been cancelled')
  } catch (error) {
    console.error('Error in cancelAllSubscriptions:', error)
    throw error
  }
}

/**
 * @param {string[]} subscriptionIds
 */
async function rollbackCancellations(subscriptionIds) {
  console.info('Rolling back cancellations...')

  for (const subId of subscriptionIds) {
    try {
      await stripe.subscriptions.update(subId, {
        cancel_at_period_end: false,
      })
      console.info(`Rolled back cancellation for subscription: ${subId}`)
    } catch (e) {
      console.error(`Failed to rollback cancellation for ${subId}:`, e)
      // if rollback fails, manual intervention is required
      console.error('Manual intervention required for subscription:', subId)
    }
  }
}

cancelAllSubscriptions().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
