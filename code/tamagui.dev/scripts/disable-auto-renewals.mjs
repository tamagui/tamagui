#!/usr/bin/env node
// @ts-check

/**
 * Disable Auto-Renewing Subscriptions in Stripe
 *
 * Finds all active and trialing subscriptions that currently auto-renew
 * (cancel_at_period_end === false and cancel_at === null) and sets
 * cancel_at_period_end: true so they will not renew when their current period ends.
 *
 * Usage:
 *   node scripts/disable-auto-renewals.mjs --dry-run
 *   node scripts/disable-auto-renewals.mjs --apply
 *   node scripts/disable-auto-renewals.mjs --apply --yes
 *
 * Options:
 *   --dry-run       Preview subscriptions that would be updated without making changes (default)
 *   --apply         Apply changes to Stripe (sets cancel_at_period_end: true)
 *   --yes           Skip confirmation prompt when using --apply
 *   --verbose       Show details for all subscriptions (including already cancelled at period end)
 */

import Stripe from 'stripe'
import * as dotenv from 'dotenv'
import * as readline from 'readline'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const STRIPE_KEY = process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Disable Auto-Renewals',
    version: '0.1.0',
  },
})

// Optional Supabase admin sync
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

/** @type {import('@supabase/supabase-js').SupabaseClient | null} */
const supabaseAdmin =
  SUPA_URL && SUPA_KEY
    ? createClient(SUPA_URL, SUPA_KEY, {
        auth: { persistSession: false },
      })
    : null

const isApply = process.argv.includes('--apply')
const isDryRun = process.argv.includes('--dry-run') || !isApply
const skipConfirmation = process.argv.includes('--yes')
const isVerbose = process.argv.includes('--verbose')

// Delay between updates to respect rate limits
const DELAY_MS = 100

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function confirm(message) {
  if (skipConfirmation) return true

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes')
    })
  })
}

async function fetchSubscriptions(status) {
  const subs = []
  let hasMore = true
  let startingAfter = undefined

  while (hasMore) {
    const response = await stripe.subscriptions.list({
      status,
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.customer', 'data.items.data.price'],
    })

    subs.push(...response.data)
    hasMore = response.has_more
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id
    }
  }

  return subs
}

function formatDate(timestamp) {
  if (!timestamp) return 'N/A'
  return new Date(timestamp * 1000).toISOString().split('T')[0]
}

function getCustomerInfo(customer) {
  if (!customer) return { email: 'unknown', name: 'unknown' }
  if (typeof customer === 'string') return { email: customer, name: customer }
  if (customer.deleted) return { email: customer.id, name: '(deleted customer)' }
  return {
    email: customer.email || customer.id,
    name: customer.name || customer.email || customer.id,
  }
}

function getProductSummary(sub) {
  const items = sub.items?.data || []
  return items
    .map((item) => {
      const price = item.price
      const amount = price?.unit_amount ? `$${(price.unit_amount / 100).toFixed(2)}` : ''
      const interval = price?.recurring?.interval ? `/${price.recurring.interval}` : ''
      const nickname = price?.nickname || price?.product || 'Subscription'
      return `${nickname}${amount ? ` (${amount}${interval})` : ''}`
    })
    .join(', ')
}

async function main() {
  console.info('\n══════════════════════════════════════════════════════════════')
  console.info('       DISABLE AUTO-RENEWING STRIPE SUBSCRIPTIONS')
  console.info('══════════════════════════════════════════════════════════════\n')

  if (isDryRun) {
    console.info('🔍 Mode: DRY RUN (no changes will be made)')
    console.info('   To apply changes, run with: node scripts/disable-auto-renewals.mjs --apply\n')
  } else {
    console.info('⚡ Mode: LIVE APPLY (will set cancel_at_period_end: true)\n')
  }

  console.info('Fetching active and trialing subscriptions from Stripe...')
  const [activeSubs, trialingSubs] = await Promise.all([
    fetchSubscriptions('active'),
    fetchSubscriptions('trialing'),
  ])

  const allSubs = [...activeSubs, ...trialingSubs]
  console.info(`  Total subscriptions fetched: ${allSubs.length} (${activeSubs.length} active, ${trialingSubs.length} trialing)\n`)

  const autoRenewing = []
  const alreadyCanceling = []

  for (const sub of allSubs) {
    const isAutoRenewing = !sub.cancel_at_period_end && !sub.cancel_at
    const customer = getCustomerInfo(sub.customer)
    const periodEnd = formatDate(sub.current_period_end)
    const products = getProductSummary(sub)

    const item = {
      id: sub.id,
      status: sub.status,
      customerEmail: customer.email,
      customerName: customer.name,
      currentPeriodEnd: periodEnd,
      products,
      sub,
    }

    if (isAutoRenewing) {
      autoRenewing.push(item)
    } else {
      alreadyCanceling.push(item)
    }
  }

  console.info('═'.repeat(60))
  console.info('                    BREAKDOWN')
  console.info('═'.repeat(60))
  console.info(`  Auto-renewing (will disable):     ${autoRenewing.length}`)
  console.info(`  Already canceling at period end:  ${alreadyCanceling.length}`)
  console.info(`  Total active/trialing:            ${allSubs.length}`)
  console.info('═'.repeat(60) + '\n')

  if (autoRenewing.length === 0) {
    console.info('✅ No auto-renewing subscriptions found! All subscriptions are already canceled or set to cancel at period end.\n')
    return
  }

  console.info(`Found ${autoRenewing.length} subscriptions that would be updated:\n`)
  for (let i = 0; i < autoRenewing.length; i++) {
    const item = autoRenewing[i]
    console.info(`  ${(i + 1).toString().padStart(3)}. ${item.id} | ${item.customerEmail.padEnd(30)} | Ends: ${item.currentPeriodEnd} | ${item.products}`)
  }
  console.info('')

  if (isDryRun) {
    console.info('═'.repeat(60))
    console.info(`🔍 DRY RUN COMPLETE: ${autoRenewing.length} subscriptions would be set to cancel_at_period_end = true.`)
    console.info('To execute these changes in Stripe, run:')
    console.info('  node scripts/disable-auto-renewals.mjs --apply')
    console.info('═'.repeat(60) + '\n')
    return
  }

  // Live Apply confirmation
  const confirmed = await confirm(`\n⚠️  Are you sure you want to disable auto-renew on ${autoRenewing.length} subscriptions in Stripe?`)
  if (!confirmed) {
    console.info('Aborted by user.')
    return
  }

  console.info(`\nUpdating ${autoRenewing.length} subscriptions in Stripe (delay ${DELAY_MS}ms)...\n`)

  let updated = 0
  let failed = 0
  const errors = []

  for (let i = 0; i < autoRenewing.length; i++) {
    const item = autoRenewing[i]
    process.stdout.write(`  [${i + 1}/${autoRenewing.length}] Updating ${item.id} (${item.customerEmail})... `)

    try {
      await stripe.subscriptions.update(item.id, {
        cancel_at_period_end: true,
      })

      // Also sync to Supabase if admin client available
      if (supabaseAdmin) {
        try {
          await supabaseAdmin
            .from('subscriptions')
            .update({
              cancel_at_period_end: true,
            })
            .eq('id', item.id)
        } catch (supaErr) {
          // Non-critical since Stripe webhook will also handle this
          console.warn(`(Supabase sync note: ${supaErr.message}) `)
        }
      }

      updated++
      console.info('✓')
    } catch (err) {
      failed++
      const msg = err instanceof Error ? err.message : String(err)
      console.info(`✗ Failed: ${msg}`)
      errors.push({ id: item.id, email: item.customerEmail, error: msg })
    }

    if (DELAY_MS > 0) {
      await sleep(DELAY_MS)
    }
  }

  console.info('\n═'.repeat(60))
  console.info('                    RESULTS')
  console.info('═'.repeat(60))
  console.info(`  Successfully updated: ${updated}`)
  console.info(`  Failed:               ${failed}`)
  console.info('═'.repeat(60) + '\n')

  if (errors.length > 0) {
    console.error('Errors encountered:')
    for (const e of errors) {
      console.error(`  - ${e.id} (${e.email}): ${e.error}`)
    }
    console.info('')
  }

  console.info('Done!')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
