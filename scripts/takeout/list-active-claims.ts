#!/usr/bin/env tsx

/**
 * List all active takeout claims to help identify test users
 *
 * Usage:
 *   tsx scripts/takeout/list-active-claims.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

interface ClaimData {
  claim_type?: string
  repository_name?: string
  user_github?: {
    id: number
    login: string
  }
  permission?: string
  team_slug?: string
  migrated_at?: string
}

interface Claim {
  id: number
  subscription_id: string
  product_id: string
  data: ClaimData
  created_at: string
  unclaimed_at: string | null
}

async function main() {
  console.log('Fetching active takeout claims...\n')

  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching claims:', error)
    process.exit(1)
  }

  const takeoutClaims = claims?.filter((claim: Claim) => {
    const data = claim.data as ClaimData
    return data?.repository_name === 'takeout'
  }) || []

  console.log(`Found ${takeoutClaims.length} active takeout claims:\n`)
  console.log('='.repeat(80))

  for (const claim of takeoutClaims) {
    const data = claim.data as ClaimData
    const username = data?.user_github?.login || 'unknown'
    const isMigrated = data?.team_slug === 'early-access'
    const migratedDate = data?.migrated_at

    console.log(`Claim ID: ${claim.id}`)
    console.log(`  Username: ${username}`)
    console.log(`  Created: ${new Date(claim.created_at).toLocaleString()}`)
    console.log(`  Migrated: ${isMigrated ? '✅ Yes' : '❌ No'}`)
    if (migratedDate) {
      console.log(`  Migrated at: ${new Date(migratedDate).toLocaleString()}`)
    }
    console.log('-'.repeat(80))
  }

  const migratedCount = takeoutClaims.filter(
    (c: Claim) => (c.data as ClaimData)?.team_slug === 'early-access'
  ).length

  console.log(`\nSummary:`)
  console.log(`  Total active: ${takeoutClaims.length}`)
  console.log(`  Migrated: ${migratedCount}`)
  console.log(`  Not migrated: ${takeoutClaims.length - migratedCount}`)
}

main().catch(console.error)
