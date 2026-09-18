#!/usr/bin/env node
// @ts-check

/**
 * Stop every Stripe subscription renewal and payment retry.
 *
 * Active, trialing, and paused subscriptions are scheduled to end at their
 * current period boundary. Past-due and unpaid subscriptions are canceled
 * immediately, and collectible open subscription invoices are voided.
 *
 * This script calls Stripe directly and does not invoke Tamagui email helpers.
 *
 * Usage:
 *   node scripts/disable-auto-renewals.mjs --dry-run
 *   node scripts/disable-auto-renewals.mjs --apply
 *   node scripts/disable-auto-renewals.mjs --apply --yes
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as readline from 'readline'
import Stripe from 'stripe'

dotenv.config()

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(stripeKey, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Disable Auto-Renewals',
    version: '0.2.0',
  },
})

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      })
    : null

const isApply = process.argv.includes('--apply')
const skipConfirmation = process.argv.includes('--yes')
const isVerbose = process.argv.includes('--verbose')
const delayMs = 100

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function confirm(message) {
  if (skipConfirmation) return true

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close()
      resolve(['y', 'yes'].includes(answer.toLowerCase()))
    })
  })
}

/** @param {Stripe.Subscription.Status} status */
async function fetchSubscriptions(status) {
  const subscriptions = []
  for await (const subscription of stripe.subscriptions.list({
    status,
    limit: 100,
    expand: ['data.customer'],
  })) {
    subscriptions.push(subscription)
  }
  return subscriptions
}

async function fetchCollectibleSubscriptionInvoices() {
  const invoices = []
  for await (const invoice of stripe.invoices.list({ status: 'open', limit: 100 })) {
    if (invoice.subscription && (invoice.auto_advance || invoice.next_payment_attempt)) {
      invoices.push(invoice)
    }
  }
  return invoices
}

function customerLabel(customer) {
  if (!customer) return 'unknown customer'
  if (typeof customer === 'string') return customer
  if (customer.deleted) return customer.id
  return customer.email || customer.id
}

function subscriptionLabel(subscription) {
  const periodEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString().slice(0, 10)
    : 'N/A'
  return `${subscription.id} | ${subscription.status} | ${customerLabel(subscription.customer)} | period ends ${periodEnd}`
}

async function syncPeriodEndCancellation(subscriptionId) {
  if (!supabaseAdmin) return

  const { error } = await supabaseAdmin
    .from('subscriptions')
    .update({ cancel_at_period_end: true })
    .eq('id', subscriptionId)

  if (error) {
    throw new Error(`Supabase sync failed: ${error.message}`)
  }
}

async function main() {
  console.info('\nDISABLE STRIPE SUBSCRIPTION RENEWALS')
  console.info(isApply ? 'Mode: LIVE APPLY\n' : 'Mode: DRY RUN\n')

  const [active, trialing, paused, pastDue, unpaid, collectibleInvoices] =
    await Promise.all([
      fetchSubscriptions('active'),
      fetchSubscriptions('trialing'),
      fetchSubscriptions('paused'),
      fetchSubscriptions('past_due'),
      fetchSubscriptions('unpaid'),
      fetchCollectibleSubscriptionInvoices(),
    ])

  const periodEndTargets = [...active, ...trialing, ...paused].filter(
    (subscription) => !subscription.cancel_at_period_end && !subscription.cancel_at
  )
  const alreadyEnding = [...active, ...trialing, ...paused].filter(
    (subscription) => subscription.cancel_at_period_end || subscription.cancel_at
  )
  const immediateTargets = [...pastDue, ...unpaid]

  console.info(`Schedule at period end: ${periodEndTargets.length}`)
  console.info(`Already scheduled to end: ${alreadyEnding.length}`)
  console.info(`Cancel immediately (past_due/unpaid): ${immediateTargets.length}`)
  console.info(`Void collectible subscription invoices: ${collectibleInvoices.length}\n`)

  if (isVerbose) {
    for (const subscription of periodEndTargets) {
      console.info(`  period end: ${subscriptionLabel(subscription)}`)
    }
    for (const subscription of immediateTargets) {
      console.info(`  immediate: ${subscriptionLabel(subscription)}`)
    }
    for (const invoice of collectibleInvoices) {
      console.info(`  invoice: ${invoice.id}`)
    }
    console.info('')
  }

  const mutationCount =
    periodEndTargets.length + immediateTargets.length + collectibleInvoices.length
  if (mutationCount === 0) {
    console.info('No renewal or retry actions remain.')
    return
  }

  if (!isApply) {
    console.info(
      `Dry run complete: ${mutationCount} Stripe mutations would be attempted.`
    )
    return
  }

  const confirmed = await confirm(
    `Stop ${periodEndTargets.length + immediateTargets.length} subscriptions and void ${collectibleInvoices.length} invoices?`
  )
  if (!confirmed) {
    console.info('Aborted.')
    return
  }

  let updated = 0
  const errors = []

  for (const subscription of periodEndTargets) {
    try {
      await stripe.subscriptions.update(
        subscription.id,
        { cancel_at_period_end: true },
        { idempotencyKey: `disable-auto-renew-${subscription.id}` }
      )
      try {
        await syncPeriodEndCancellation(subscription.id)
      } catch (error) {
        // Stripe is authoritative and its webhook also syncs this update.
        console.warn(error instanceof Error ? error.message : String(error))
      }
      updated++
    } catch (error) {
      errors.push({ id: subscription.id, error })
    }
    await sleep(delayMs)
  }

  for (const subscription of immediateTargets) {
    try {
      await stripe.subscriptions.cancel(
        subscription.id,
        { invoice_now: false, prorate: false },
        { idempotencyKey: `disable-retries-${subscription.id}` }
      )
      updated++
    } catch (error) {
      errors.push({ id: subscription.id, error })
    }
    await sleep(delayMs)
  }

  for (const invoice of collectibleInvoices) {
    try {
      const current = await stripe.invoices.retrieve(invoice.id)
      if (current.status === 'open') {
        await stripe.invoices.voidInvoice(
          invoice.id,
          {},
          { idempotencyKey: `disable-retries-${invoice.id}` }
        )
        updated++
      }
    } catch (error) {
      errors.push({ id: invoice.id, error })
    }
    await sleep(delayMs)
  }

  console.info(`Updated: ${updated}`)
  console.info(`Failed: ${errors.length}`)
  for (const { id, error } of errors) {
    console.error(`${id}: ${error instanceof Error ? error.message : String(error)}`)
  }

  if (errors.length) process.exitCode = 1
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
