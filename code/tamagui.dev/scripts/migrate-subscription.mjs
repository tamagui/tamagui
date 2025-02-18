/**
 * Subscription Migration Script
 *
 * This script handles the migration of subscriptions from the old Bento/Takeout products
 * to the new unified Tamagui Pro plan. The migration process includes:
 *
 * 1. Finding all active subscriptions for old products (Bento/Takeout)
 * 2. Creating new subscriptions under the Tamagui Pro plan
 * 3. Setting up a trial period until the end of their current billing period
 * 4. Canceling old subscriptions
 * 5. Maintaining detailed migration logs
 *
 * The script ensures a seamless transition by:
 * - Preserving the billing cycle (no immediate charges for the new plan)
 * - Maintaining subscription metadata and relationships
 * - Handling errors gracefully with detailed logging
 *
 * @module migrate-subscription
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

const MIGRATION_LOG_FILE = join(process.cwd(), 'migration_logs.json')

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
 */

/**
 * Retrieves all active subscriptions that need to be migrated.
 * This includes subscriptions that are:
 * - Not canceled
 * - In 'active' or 'trialing' status
 * - Associated with old product IDs (Bento/Takeout)
 *
 * @returns {Promise<any[]>} Array of subscriptions that need migration
 */
async function getActiveSubscriptions() {
  const { data: subscriptions, error } = await supabaseAdmin
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
    .is('canceled_at', null)
    .filter('status', 'in', '("active","trialing")')

  if (error) throw error

  return subscriptions.filter((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.prices?.products?.id && OLD_PRODUCT_IDS.includes(item.prices.products.id)
    )
  )
}

/**
 * Migrates a single subscription from an old product to the new Tamagui Pro plan.
 * The process includes:
 * 1. Creating a new subscription with the Pro plan
 * 2. Setting up a trial period until the current period ends
 * 3. Canceling the old subscription
 * 4. Updating metadata and database records
 *
 * @param {any} subscription - The subscription to migrate
 * @returns {Promise<MigrationResult>} Result of the migration attempt
 */
async function migrateSubscription(subscription) {
  console.info(`Migrating subscription: ${subscription.id}`)

  try {
    // Get the current subscription from Stripe to ensure we have the latest data
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription.id)

    // Create a new subscription with the new price
    // Set trial_end to the current subscription's current period end
    // This ensures no charges until the current period ends
    const newSubscription = await stripe.subscriptions.create({
      customer:
        typeof stripeSubscription.customer === 'string'
          ? stripeSubscription.customer
          : stripeSubscription.customer.id,
      items: [{ price: NEW_PRICE_ID }],
      trial_end: stripeSubscription.current_period_end,
      metadata: {
        migrated_from: subscription.id,
        original_product:
          subscription.subscription_items?.[0]?.prices?.products?.id || 'unknown',
      },
    })

    // Cancel the old subscription immediately since we're using trial_end for the transition
    await stripe.subscriptions.cancel(subscription.id)

    // Update the old subscription's metadata separately
    await stripe.subscriptions.update(subscription.id, {
      metadata: {
        migrated_to: newSubscription.id,
      },
    })

    // Update Supabase records to reflect the migration
    await supabaseAdmin
      .from('subscriptions')
      .update({
        metadata: {
          ...subscription.metadata,
          migrated_to: newSubscription.id,
        },
        canceled_at: new Date().toISOString(),
      })
      .eq('id', subscription.id)

    console.info(
      `Successfully migrated subscription ${subscription.id} to ${newSubscription.id}`
    )

    return {
      success: true,
      oldId: subscription.id,
      newId: newSubscription.id,
      customer:
        typeof stripeSubscription.customer === 'string'
          ? stripeSubscription.customer
          : stripeSubscription.customer.id,
      originalProduct:
        subscription.subscription_items?.[0]?.prices?.products?.id || 'unknown',
    }
  } catch (error) {
    console.error(`Failed to migrate subscription ${subscription.id}:`, error)
    return {
      success: false,
      oldId: subscription.id,
      error: error instanceof Error ? error.message : String(error),
      customer: subscription.user_id,
      originalProduct:
        subscription.subscription_items?.[0]?.prices?.products?.id || 'unknown',
    }
  }
}

/**
 * Main migration function that:
 * 1. Retrieves all subscriptions that need migration
 * 2. Processes each subscription
 * 3. Maintains a detailed log of successful and failed migrations
 * 4. Writes results to a JSON file for audit purposes
 *
 * The function continues processing even if individual migrations fail,
 * ensuring that a single failure doesn't stop the entire migration process.
 *
 * @returns {Promise<MigrationLog>} Complete migration results
 */
async function migrateAllSubscriptions() {
  /** @type {MigrationLog} */
  const migrationLog = {
    timestamp: new Date().toISOString(),
    successful: [],
    failed: [],
  }

  try {
    // Get all active subscriptions for old products
    const subscriptions = await getActiveSubscriptions()
    console.info(`Found ${subscriptions.length} subscriptions to migrate`)

    // Migrate each subscription
    for (const subscription of subscriptions) {
      const result = await migrateSubscription(subscription)
      if (result.success && result.newId) {
        migrationLog.successful.push({
          oldId: result.oldId,
          newId: result.newId,
          customer: result.customer,
          originalProduct: result.originalProduct,
        })
      } else {
        migrationLog.failed.push({
          oldId: result.oldId,
          error: result.error || 'Unknown error',
          customer: result.customer,
          originalProduct: result.originalProduct,
        })
      }
    }

    // Write migration log to file for audit purposes
    await writeFile(MIGRATION_LOG_FILE, JSON.stringify(migrationLog, null, 2))

    // Summary
    console.info('Migration completed:')
    console.info(
      `Successfully migrated: ${migrationLog.successful.length}/${subscriptions.length}`
    )
    console.info(`Failed migrations: ${migrationLog.failed.length}`)
    console.info(`Migration log written to: ${MIGRATION_LOG_FILE}`)

    return migrationLog
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Execute the migration
migrateAllSubscriptions().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
