// @ts-check

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

/** @typedef {import('../features/supabase/types').Database} Database */

// Load .env.local file
dotenv.config({ path: '.env.local' })

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!SUPA_URL || !SUPA_KEY) {
  throw new Error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set')
}

console.info(`Connecting to supabase: ${SUPA_URL}`)

/** @type {import('@supabase/supabase-js').SupabaseClient<Database>} */
const supabaseAdmin = createClient(SUPA_URL, SUPA_KEY)

// Bento price ID
const BENTO_PRICE_ID = 'price_1OiqquFQGtHoG6xcZxZaVF2B'

async function insertBentoProductOwnership(userEmail) {
  if (!userEmail) {
    throw new Error('userEmail is required')
  }

  try {
    // First, find the user by email
    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', userEmail)
      .single()

    if (userError || !user) {
      throw new Error(`User not found with email: ${userEmail}`)
    }

    console.info(`Found user: ${user.id} (${user.email})`)

    // Check if user already has this product ownership
    const { data: existingOwnership, error: ownershipError } = await supabaseAdmin
      .from('product_ownership')
      .select('*')
      .eq('user_id', user.id)
      .eq('price_id', BENTO_PRICE_ID)

    if (ownershipError) {
      throw ownershipError
    }

    if (existingOwnership && existingOwnership.length > 0) {
      console.info(
        `User already has Bento product ownership (ID: ${existingOwnership[0].id})`
      )
      return
    }

    // Insert new product ownership record
    const { data: newOwnership, error: insertError } = await supabaseAdmin
      .from('product_ownership')
      .insert({
        price_id: BENTO_PRICE_ID,
        user_id: user.id,
      })
      .select()
      .single()

    if (insertError) {
      throw insertError
    }

    console.info(`Successfully created Bento product ownership for user: ${userEmail}`)
    console.info(`Product ownership ID: ${newOwnership.id}`)
    console.info(`Price ID: ${BENTO_PRICE_ID}`)
    console.info(`User ID: ${user.id}`)
  } catch (error) {
    console.error('Error in insertBentoProductOwnership:', error)
    throw error
  }
}

const userEmail = process.argv[2]
if (!userEmail) {
  console.error('Please provide a user email as an argument')
  console.error('Usage: node insert-bento-product-ownership.mjs user@example.com')
  process.exit(1)
}

insertBentoProductOwnership(userEmail).catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
