// migrate-one-time-payments.mjs
// @ts-check

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Supabase environment variables are not set')
}

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'One-time Payment Migration Script',
    version: '0.1.0',
  },
})

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const PRO_ONE_TIME_PRICE_ID = 'price_1Qs41HFQGtHoG6xcerDq7RJZ'

async function migrateOneTimePayments() {
  try {
    console.info('Fetching one-time payment invoices...')

    // 支払い済みのinvoiceを取得
    const invoices = await stripe.invoices.list({
      status: 'paid',
    })

    console.info(`Found ${invoices.data.length} invoices`)

    for (const invoice of invoices.data) {
      const hasProPlan = invoice.lines.data.some(
        (item) => item.price?.id === PRO_ONE_TIME_PRICE_ID
      )

      if (!hasProPlan || invoice.subscription !== null) {
        console.info(
          `Skipping invoice ${invoice.id} (not a Pro plan or has subscription)`
        )
        continue
      }

      console.info(`Processing invoice ${invoice.id}...`)

      try {
        const { data: customerData, error: customerError } = await supabase
          .from('customers')
          .select('id')
          .eq('stripe_customer_id', invoice.customer)
          .single()

        if (customerError) {
          console.error(`No customer found for invoice ${invoice.id}:`, customerError)
          continue
        }

        const { data: existingSub } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('id', invoice.id)
          .single()

        if (existingSub) {
          console.info(`Subscription already exists for invoice ${invoice.id}`)
          continue
        }

        const oneYearFromInvoice = new Date(invoice.created * 1000)
        oneYearFromInvoice.setFullYear(oneYearFromInvoice.getFullYear() + 1)

        await supabase.from('subscriptions').insert({
          id: invoice.id,
          user_id: customerData.id,
          metadata: invoice.metadata,
          status: 'active',
          cancel_at: oneYearFromInvoice.toISOString(),
          current_period_start: new Date(invoice.created * 1000).toISOString(),
          current_period_end: oneYearFromInvoice.toISOString(),
          created: new Date(invoice.created * 1000).toISOString(),
        })

        const validLineItems = invoice.lines.data.filter(
          (item) => item.price !== null && item.price !== undefined
        )

        const subscriptionItems = validLineItems.map((item) => ({
          id: item.id,
          subscription_id: invoice.id,
          price_id: item.price?.id,
        }))

        if (subscriptionItems.length > 0) {
          await supabase.from('subscription_items').insert(subscriptionItems)
        }

        console.info(`Successfully migrated invoice ${invoice.id}`)
      } catch (error) {
        console.error(`Error processing invoice ${invoice.id}:`, error)
      }
    }

    console.info('Migration completed')
  } catch (error) {
    console.error('Error during migration:', error)
    process.exit(1)
  }
}

migrateOneTimePayments()
