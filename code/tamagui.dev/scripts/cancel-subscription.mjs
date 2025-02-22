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
    name: 'Tamagui Subscription Canceller',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

async function cancelSubscription(userId) {
  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    // ユーザーの存在確認
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      throw new Error(`User not found: ${userId}`)
    }

    // アクティブなサブスクリプションを取得
    const { data: subscriptions, error: subError } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['active', 'trialing'])

    if (subError) throw subError

    if (!subscriptions.length) {
      console.info(`No active subscriptions found for user: ${userId}`)
      return
    }

    console.info(`Found ${subscriptions.length} active subscriptions for user: ${userId}`)

    for (const sub of subscriptions) {
      try {
        const canceledSubscription = await stripe.subscriptions.cancel(sub.id, {
          prorate: true,
        })

        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            ended_at: new Date().toISOString(),
          })
          .eq('id', sub.id)

        console.info(`Successfully cancelled subscription: ${sub.id}`)
      } catch (e) {
        console.error(`Failed to cancel subscription ${sub.id}:`, e)
        throw e
      }
    }

    console.info(`All subscriptions have been cancelled for user: ${userId}`)
  } catch (error) {
    console.error('Error in cancelSubscription:', error)
    throw error
  }
}

const userId = process.argv[2]
if (!userId) {
  console.error('Please provide a user ID as an argument')
  process.exit(1)
}

cancelSubscription(userId).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
