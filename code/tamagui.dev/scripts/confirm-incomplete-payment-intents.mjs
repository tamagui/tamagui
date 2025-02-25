// confirm-incomplete-payment-intents.mjs
// @ts-check

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Incomplete PaymentIntent Confirmer',
    version: '0.1.0',
  },
})

// 過去7日間（秒単位）
const sevenDaysAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000)

async function confirmIncompletePaymentIntents() {
  try {
    console.info(
      `Fetching PaymentIntents created since: ${new Date(sevenDaysAgo * 1000).toISOString()}`
    )
    const paymentIntents = await stripe.paymentIntents.list({
      created: { gte: sevenDaysAgo },
      limit: 100,
    })

    console.info(`Found ${paymentIntents.data.length} PaymentIntents`)

    for (const pi of paymentIntents.data) {
      if (pi.status === 'requires_confirmation' || pi.status === 'requires_action') {
        console.info(`Confirming PaymentIntent ${pi.id} (status: ${pi.status})`)
        try {
          const confirmOptions = {}

          if (pi.payment_method_types.includes('link') && pi.setup_future_usage) {
            confirmOptions.mandate_data = {
              customer_acceptance: {
                type: 'online',
                online: {
                  ip_address: '0.0.0.0',
                  user_agent: 'Stripe Link Background Confirmation Script',
                },
              },
            }
          }

          const confirmed = await stripe.paymentIntents.confirm(pi.id, confirmOptions)
          console.info(
            `PaymentIntent ${pi.id} confirmed successfully. New status: ${confirmed.status}`
          )
        } catch (error) {
          console.error(`Failed to confirm PaymentIntent ${pi.id}:`, error.message)
        }
      } else {
        console.info(`Skipping PaymentIntent ${pi.id} (status: ${pi.status})`)
      }
    }
  } catch (error) {
    console.error('Error fetching or confirming PaymentIntents:', error)
    process.exit(1)
  }
}

confirmIncompletePaymentIntents()
