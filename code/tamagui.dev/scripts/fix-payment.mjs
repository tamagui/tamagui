// @ts-check
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
    name: 'Subscription Fixer',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('Supabase environment variables are not set')
}

const supabase = createClient(SUPA_URL, SUPA_KEY)

/**
 * @param {string} userId
 * @param {string} invoiceId
 * @returns
 */
async function fixSubscription(userId, invoiceId) {
  try {
    const invoice = await stripe.invoices.retrieve(invoiceId)
    const now = new Date(invoice.created * 1000)
    const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1))

    await supabase.from('subscriptions').insert({
      id: invoiceId,
      user_id: userId,
      metadata: invoice.metadata,
      status: 'active',
      cancel_at: oneYearFromNow.toISOString(),
      current_period_start: new Date(invoice.created * 1000).toISOString(),
      current_period_end: oneYearFromNow.toISOString(),
      created: new Date(invoice.created * 1000).toISOString(),
    })

    const subscriptionItems = invoice.lines.data
      .filter((item) => Boolean(item.price?.id))
      .map((item) => ({
        id: item.id,
        subscription_id: invoiceId,
        price_id: item.price?.id,
      }))

    if (subscriptionItems.length > 0) {
      await supabase.from('subscription_items').insert(subscriptionItems)
    }

    console.info('Successfully fixed subscription for user:', userId)
  } catch (error) {
    console.error('Failed to fix subscription:', error)
    throw error
  }
}

// fixSubscription().catch((error) => {
//   console.error('Script failed:', error)
//   process.exit(1)
// })
