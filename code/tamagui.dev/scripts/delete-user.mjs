// @ts-check

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

/** @typedef {import('../features/supabase/types').Database} Database */

dotenv.config()

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

async function deleteUser(userId) {
  if (!userId) {
    throw new Error('userId is required')
  }

  try {
    console.info(`Starting deletion process for user: ${userId}`)

    // Define table mappings with their correct column names
    const tableMappings = [
      { schema: 'public', table: 'studio_themes', column: 'user_id' },
      { schema: 'public', table: 'theme_histories', column: 'user_id' },
      { schema: 'public', table: 'product_ownership', column: 'user_id' },
      { schema: 'public', table: 'team_members', column: 'member_id' },
      { schema: 'public', table: 'team_subscriptions', column: 'owner_id' },
      { schema: 'public', table: 'customers', column: 'id' },
      { schema: 'public', table: 'users_private', column: 'id' },
      { schema: 'public', table: 'users', column: 'id' },
      { schema: 'auth', table: 'sessions', column: 'user_id' },
      { schema: 'auth', table: 'mfa_factors', column: 'user_id' },
      { schema: 'auth', table: 'identities', column: 'user_id' },
      { schema: 'auth', table: 'one_time_tokens', column: 'user_id' },
    ]

    // Delete from each table with proper column reference
    for (const { schema, table, column } of tableMappings) {
      console.info(`Deleting from ${schema}.${table} where ${column} = ${userId}...`)

      const { error } = await supabaseAdmin.from(table).delete().eq(column, userId)

      if (error) {
        // Log the error but continue with deletion process
        console.warn(`Warning while deleting from ${schema}.${table}:`, error)
      }
    }

    // Finally delete the user from auth.users
    console.info('Deleting user from auth.users...')
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (authError) {
      throw authError
    }

    console.info(`Successfully deleted user: ${userId}`)
  } catch (error) {
    console.error('Error in deleteUser:', error)
    throw error
  }
}

const userId = process.argv[2]
if (!userId) {
  console.error('Please provide a user ID as an argument')
  process.exit(1)
}

deleteUser(userId).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
