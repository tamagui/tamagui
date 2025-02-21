/**
 * Subscription Migration Script
 *
 * Handles the migration of subscriptions from Bento/Takeout to Tamagui Pro plan.
 * The migration process includes:
 *
 * 1. Finding active/trialing subscriptions in Supabase for old products
 * 2. Creating new Tamagui Pro subscriptions with:
 *    - Trial period until current period ends
 *    - Metadata linking old and new subscriptions
 * 3. Setting old subscriptions to cancel at period end
 * 4. Maintaining detailed migration logs
 *
 * Configuration:
 * - OLD_PRODUCT_IDS: ['prod_NzLEazaqBgoKnC', 'prod_PT7X4Dse6jhTVL'] (Bento/Takeout)
 * - NEW_PRODUCT_ID: 'prod_RlRd2DVrG0frHe' (Tamagui Pro)
 * - NEW_PRICE_ID: 'price_1QthHSFQGtHoG6xcDOEuFsrW'
 *
 * The script ensures a seamless transition by:
 * - Preserving billing cycles (no immediate charges)
 * - Maintaining subscription metadata and relationships
 * - Handling errors gracefully with detailed logging
 */

// @ts-check

import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/** @typedef {import('../features/supabase/types').Database} Database */

dotenv.config()

// Use test keys for development and live keys for production
const STRIPE_KEY = process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY
if (!STRIPE_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set')
}

const stripe = new Stripe(STRIPE_KEY, {
  apiVersion: '2020-08-27',
  appInfo: {
    name: 'Tamagui Subscription Migration',
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

/**
 * Product IDs configuration
 * OLD_PRODUCT_IDS: Array of product IDs that need to be migrated (Bento and Takeout)
 * NEW_PRODUCT_ID: The target Tamagui Pro product ID
 * NEW_PRICE_ID: The active price ID for the new Tamagui Pro product
 */
const OLD_PRODUCT_IDS = ['prod_NzLEazaqBgoKnC', 'prod_PT7X4Dse6jhTVL']
const NEW_PRODUCT_ID = 'prod_RlRd2DVrG0frHe'
const NEW_PRICE_ID = 'price_1QthHSFQGtHoG6xcDOEuFsrW'

/**
 * Represents a successful migration record
 * @typedef {{ oldId: string, newId: string, customer: string, originalProduct: string }} SuccessfulMigration
 */

/**
 * Represents a failed migration record
 * @typedef {{ oldId: string, error: string, customer: string, originalProduct: string }} FailedMigration
 */

/**
 * Structure of the migration log file
 * @typedef {{ timestamp: string, successful: SuccessfulMigration[], failed: FailedMigration[] }} MigrationLog
 */

/**
 * Result of a single subscription migration attempt
 * @typedef {Object} MigrationResult
 * @property {boolean} success - Whether the migration was successful
 * @property {string} oldId - ID of the original subscription
 * @property {string} [newId] - ID of the new subscription (only present if successful)
 * @property {string} [error] - Error message (only present if failed)
 * @property {string} customer - Customer ID
 * @property {string} originalProduct - Original product ID
 * @property {string} [effectiveDate] - The date when the new subscription becomes effective
 */

const MIGRATION_LOG_FILE = join(process.cwd(), 'migration_logs.json')

/**
 * Retrieves the Stripe subscription details, including cancelled ones
 * @param {string} subscriptionId - The ID of the subscription to retrieve
 * @returns {Promise<Stripe.Subscription>} The subscription details
 */
async function getStripeSubscription(subscriptionId) {
  try {
    // First, get the subscription with customer
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['customer'],
    })

    // Then, get items separately
    const items = await Promise.all(
      subscription.items.data.map(async (item) => {
        const expandedItem = await stripe.subscriptionItems.retrieve(item.id, {
          expand: ['price', 'price.product'],
        })
        return expandedItem
      })
    )

    // Combine the data
    return {
      ...subscription,
      items: {
        data: items,
        object: 'list',
        has_more: false,
        url: `/v1/subscription_items?subscription=${subscriptionId}`,
      },
    }
  } catch (error) {
    console.error(`Failed to retrieve subscription ${subscriptionId}:`, error)
    throw error
  }
}

/**
 * Migrates a single subscription from an old product to the new Tamagui Pro plan.
 * The migration process:
 * 1. Creates a new subscription with trial period until current period ends
 * 2. Sets the old subscription to cancel at period end
 * 3. Maintains metadata for tracking the migration
 *
 * @param {Stripe.Subscription} subscription - The subscription to migrate
 * @returns {Promise<MigrationResult>} Result of the migration attempt
 */
async function migrateSubscription(subscription) {
  try {
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000)
    const customerId =
      typeof subscription.customer === 'string'
        ? subscription.customer
        : subscription.customer.id

    // Create new subscription with trial until current period ends
    const newSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: NEW_PRICE_ID }],
      trial_end: Math.floor(currentPeriodEnd.getTime() / 1000),
      metadata: {
        migrated_from: subscription.id,
        original_product:
          typeof subscription.items.data[0]?.price?.product === 'string'
            ? subscription.items.data[0]?.price?.product
            : subscription.items.data[0]?.price?.product?.id || 'unknown',
        original_price: subscription.items.data[0]?.price?.unit_amount || 0,
        migration_date: new Date().toISOString(),
      },
    })

    // Update old subscription to cancel at period end
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
      metadata: {
        ...subscription.metadata,
        migrated_to: newSubscription.id,
        migration_date: new Date().toISOString(),
      },
    })

    return {
      success: true,
      oldId: subscription.id,
      newId: newSubscription.id,
      customer: customerId,
      originalProduct:
        typeof subscription.items.data[0]?.price?.product === 'string'
          ? subscription.items.data[0]?.price?.product
          : subscription.items.data[0]?.price?.product?.id || 'unknown',
      effectiveDate: currentPeriodEnd.toISOString(),
    }
  } catch (error) {
    console.error(`Failed to migrate subscription ${subscription.id}:`, error)
    return {
      success: false,
      oldId: subscription.id,
      error: error instanceof Error ? error.message : String(error),
      customer:
        typeof subscription.customer === 'string'
          ? subscription.customer
          : subscription.customer.id,
      originalProduct:
        typeof subscription.items.data[0]?.price?.product === 'string'
          ? subscription.items.data[0]?.price?.product
          : subscription.items.data[0]?.price?.product?.id || 'unknown',
    }
  }
}

/**
 * Main migration function that:
 * 1. Retrieves all subscriptions that need migration
 * 2. Creates new subscriptions with trial periods
 * 3. Sets old subscriptions to cancel at period end
 * 4. Maintains detailed migration logs
 */
async function migrateSubscriptions() {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

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
    console.error('Error fetching Supabase subscriptions:', error)
    throw error
  }

  console.info('2. Processing Supabase subscriptions...')
  const subscriptionsToMigrate = supabaseSubscriptions.filter((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.prices?.products?.id && OLD_PRODUCT_IDS.includes(item.prices.products.id)
    )
  )

  console.info(`Found ${subscriptionsToMigrate.length} subscriptions to migrate`)

  /** @type {MigrationLog} */
  const migrationLog = {
    timestamp: new Date().toISOString(),
    successful: [],
    failed: [],
  }

  for (const sub of subscriptionsToMigrate) {
    try {
      console.info(`Processing subscription ${sub.id}...`)

      // Get full subscription data from Stripe
      const stripeSubscription = await getStripeSubscription(sub.id)
      if (!stripeSubscription) {
        console.warn(`Skipping subscription ${sub.id}: Not found in Stripe`)
        continue
      }

      // Migrate the subscription
      const result = await migrateSubscription(stripeSubscription)

      if (result.success && result.newId) {
        migrationLog.successful.push({
          oldId: result.oldId,
          newId: result.newId,
          customer: result.customer,
          originalProduct: result.originalProduct,
        })
        console.info(`Successfully migrated subscription ${sub.id} to ${result.newId}`)
        console.info(`New subscription will start billing on: ${result.effectiveDate}`)
      } else {
        migrationLog.failed.push({
          oldId: result.oldId,
          error: result.error || 'Unknown error',
          customer: result.customer,
          originalProduct: result.originalProduct,
        })
        console.error(`Failed to migrate subscription ${sub.id}:`, result.error)
      }
    } catch (error) {
      console.error(`Error processing subscription ${sub.id}:`, error)
      migrationLog.failed.push({
        oldId: sub.id,
        error: error instanceof Error ? error.message : String(error),
        customer: sub.user_id,
        originalProduct: sub.subscription_items?.[0]?.prices?.products?.id || 'unknown',
      })
    }
  }

  // Write migration log to file
  await writeFile(MIGRATION_LOG_FILE, JSON.stringify(migrationLog, null, 2))

  console.info('\nMigration Summary:')
  console.info(`Total subscriptions processed: ${subscriptionsToMigrate.length}`)
  console.info(`Successful migrations: ${migrationLog.successful.length}`)
  console.info(`Failed migrations: ${migrationLog.failed.length}`)
  console.info(`Migration log written to: ${MIGRATION_LOG_FILE}`)

  return migrationLog
}

// Execute the migration
migrateSubscriptions().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
