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

async function insertEmailToUser() {
  try {
    console.info('Starting email insertion process...')

    let currentPage = 1
    let hasMore = true

    while (hasMore) {
      console.info(`Processing page ${currentPage}...`)

      // Get users for current page
      const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.listUsers({
          page: currentPage,
          perPage: 1000, // Maximum allowed by Supabase
        })

      if (authError) throw authError

      const { users, nextPage, lastPage } = authData
      console.info(`Found ${users.length} users on page ${currentPage}`)

      // Process users in batches to avoid overwhelming the database
      const BATCH_SIZE = 100
      for (let i = 0; i < users.length; i += BATCH_SIZE) {
        const batch = users.slice(i, i + BATCH_SIZE)
        const updates = batch.map((user) => ({
          id: user.id,
          email: user.email,
        }))

        console.info(`Updating batch of ${updates.length} users...`)
        const { error: updateError } = await supabaseAdmin.from('users').upsert(updates, {
          onConflict: 'id',
        })

        if (updateError) {
          console.warn('Warning during batch update:', updateError)
        }
      }

      // Check if we've reached the last page
      hasMore = currentPage < lastPage
      currentPage++

      // Add a small delay to avoid rate limiting
      if (hasMore) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    console.info('Email insertion process completed')
  } catch (error) {
    console.error('Error in insertEmailToUser:', error)
    throw error
  }
}

insertEmailToUser().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
