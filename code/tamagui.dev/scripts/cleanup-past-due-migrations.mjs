// @ts-check

/**
 * Cleanup Past Due Migration Subscriptions
 *
 * These subscriptions were created during a Feb 2025 migration with 1-year trials
 * but no payment method attached. Now the trials are ending and they're going
 * past_due with no way to collect payment.
 *
 * This script cancels them to clean up Stripe.
 *
 * Usage:
 *   node scripts/cleanup-past-due-migrations.mjs [--dry-run]
 *
 * Options:
 *   --dry-run    Show what would be cancelled without actually cancelling
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Migration Cleanup',
    version: '0.1.0',
  },
})

const isDryRun = process.argv.includes('--dry-run')

async function main() {
  console.info('\n=== Cleanup Past Due Migration Subscriptions ===\n')

  if (isDryRun) {
    console.info('🔍 DRY RUN MODE - No changes will be made\n')
  }

  // get all past_due subscriptions
  console.info('Fetching past_due subscriptions...')
  const pastDueSubs = []
  let hasMore = true
  let startingAfter = undefined

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      status: 'past_due',
      limit: 100,
      starting_after: startingAfter,
    })

    pastDueSubs.push(...response.data)
    hasMore = response.has_more
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  console.info(`Found ${pastDueSubs.length} past_due subscriptions\n`)

  // filter to only migrated subscriptions (have migrated_from metadata)
  const migratedSubs = pastDueSubs.filter((sub) => sub.metadata?.migrated_from)
  console.info(`${migratedSubs.length} are from the Feb 2025 migration\n`)

  if (migratedSubs.length === 0) {
    console.info('Nothing to clean up!')
    return
  }

  // show what we're going to do
  console.info('Subscriptions to cancel:')
  console.info('─'.repeat(80))

  for (const sub of migratedSubs) {
    const customer =
      typeof sub.customer === 'string'
        ? await stripe.customers.retrieve(sub.customer)
        : sub.customer

    const email = customer.deleted ? 'DELETED' : customer.email || 'unknown'
    const trialEnd = sub.trial_end
      ? new Date(sub.trial_end * 1000).toISOString().split('T')[0]
      : 'none'

    console.info(`  ${sub.id}`)
    console.info(`    Email: ${email}`)
    console.info(`    Migrated from: ${sub.metadata.migrated_from}`)
    console.info(`    Trial ended: ${trialEnd}`)
    console.info('')
  }

  if (isDryRun) {
    console.info(`\n🔍 DRY RUN: Would cancel ${migratedSubs.length} subscriptions`)
    console.info('Run without --dry-run to actually cancel them')
    return
  }

  // cancel them
  console.info(`\nCancelling ${migratedSubs.length} subscriptions...`)

  let cancelled = 0
  let failed = 0

  for (const sub of migratedSubs) {
    try {
      await stripe.subscriptions.cancel(sub.id, {
        invoice_now: false, // don't try to invoice
        prorate: false,
      })
      cancelled++
      console.info(`  ✓ Cancelled ${sub.id}`)
    } catch (error) {
      failed++
      console.error(`  ✗ Failed to cancel ${sub.id}: ${error.message}`)
    }
  }

  console.info('\n=== Summary ===')
  console.info(`Cancelled: ${cancelled}`)
  console.info(`Failed: ${failed}`)
  console.info('\nDone!')
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
