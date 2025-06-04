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
    name: 'Tamagui Payment Investigator',
    version: '0.1.0',
  },
})

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('Supabase environment variables are not set')
}

const supabase = createClient(SUPA_URL, SUPA_KEY)

async function investigatePayment(userId, invoiceId) {
  console.info('Starting investigation...\n')

  try {
    console.info('Checking user information...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (userError) {
      throw new Error(`User not found: ${userError.message}`)
    }
    console.info('User found:', user)

    console.info('\nChecking Stripe customer information...')
    const { data: customer, error: customerError } = await supabase
      .from('customers')
      .select('stripe_customer_id')
      .eq('id', userId)
      .single()

    if (customerError) {
      throw new Error(`Customer not found: ${customerError.message}`)
    }

    console.info('Customer found:', customer)

    console.info('\nChecking Stripe invoice...')
    const invoice = await stripe.invoices.retrieve(invoiceId)
    console.info('Invoice status:', invoice.status)
    console.info('Invoice amount paid:', invoice.amount_paid / 100)
    console.info('Invoice created:', new Date(invoice.created * 1000).toISOString())
    console.info('Payment intent:', invoice.payment_intent)

    if (invoice.subscription) {
      console.info('This is a subscription invoice')
    } else {
      console.info('This is a one-time payment invoice')
    }

    console.info('\nChecking Supabase subscriptions...')
    const { data: subscriptions, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)

    if (subError) {
      throw new Error(`Error fetching subscriptions: ${subError.message}`)
    }

    if (subscriptions.length === 0) {
      console.info('No subscriptions found in database')
    } else {
      console.info('Found subscriptions:', subscriptions.length)
      subscriptions.forEach((sub) => {
        console.info(`- ID: ${sub.id}`)
        console.info(`  Status: ${sub.status}`)
        console.info(`  Created: ${sub.created}`)
        console.info(
          `  Current period: ${sub.current_period_start} -> ${sub.current_period_end}`
        )
      })
    }
  } catch (error) {
    console.error('Investigation failed:', error)
    throw error
  }
}

// investigatePayment(userId, invoiceId).catch((error) => {
//   console.error('Script failed:', error)
//   process.exit(1)
// })
