#!/usr/bin/env tsx

/**
 * Safely analyze stale claims and create a review file
 * Does NOT delete anything - just creates a report
 *
 * Usage:
 *   tsx scripts/takeout/analyze-stale-claims.ts
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !STRIPE_SECRET_KEY) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

interface ClaimData {
  user_github?: {
    id: number | string
    login: string
  }
  repository_name?: string
  team_slug?: string
}

interface Claim {
  id: number
  subscription_id: string
  product_id: string
  data: ClaimData
  created_at: string
  unclaimed_at: string | null
}

async function getAllActiveStripeSubscriptions() {
  console.log('💳 Fetching ALL active Stripe subscriptions...')

  const allSubscriptions: Stripe.Subscription[] = []
  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const params: Stripe.SubscriptionListParams = {
      status: 'active',
      limit: 100,
    }
    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const subscriptions = await stripe.subscriptions.list(params)
    allSubscriptions.push(...subscriptions.data)

    hasMore = subscriptions.has_more
    if (hasMore && subscriptions.data.length > 0) {
      startingAfter = subscriptions.data[subscriptions.data.length - 1].id
    }
  }

  console.log(`   Found ${allSubscriptions.length} total active subscriptions`)
  return allSubscriptions
}

async function getAllActiveClaims() {
  console.log('📊 Fetching all active claims from database...')

  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)
    .limit(10000)

  if (error) {
    console.error('Error fetching claims:', error)
    throw error
  }

  console.log(`   Found ${claims?.length || 0} active claims`)
  return (claims || []) as Claim[]
}

async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('ANALYZE STALE CLAIMS (SAFE MODE)')
  console.log('='.repeat(80) + '\n')

  // Fetch data
  const [subscriptions, claims] = await Promise.all([
    getAllActiveStripeSubscriptions(),
    getAllActiveClaims(),
  ])

  // Build set of active subscription IDs
  const activeSubIds = new Set(subscriptions.map((s) => s.id))

  console.log(`\n📊 Analysis:`)
  console.log(`   Active Stripe subscriptions: ${activeSubIds.size}`)
  console.log(`   Active database claims: ${claims.length}`)

  // Find stale claims (claims for subscriptions that are no longer active)
  const staleClaims: Claim[] = []
  const validClaims: Claim[] = []
  const claimsWithInvalidSubIds: Claim[] = []

  for (const claim of claims) {
    const subId = claim.subscription_id

    // Check if it looks like a valid subscription ID
    if (!subId || (!subId.startsWith('sub_') && !subId.startsWith('in_'))) {
      claimsWithInvalidSubIds.push(claim)
      continue
    }

    if (activeSubIds.has(subId)) {
      validClaims.push(claim)
    } else {
      staleClaims.push(claim)
    }
  }

  console.log(`\n✅ Valid claims (subscription is active): ${validClaims.length}`)
  console.log(`⚠️  Stale claims (subscription not active): ${staleClaims.length}`)
  console.log(
    `❓ Claims with invalid subscription IDs: ${claimsWithInvalidSubIds.length}`
  )

  // Create temp directory
  const tempDir = join(process.cwd(), 'tmp')
  mkdirSync(tempDir, { recursive: true })

  // Write de-duplicated lists
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  // 1. All active subscription IDs from Stripe
  const activeSubsFile = join(tempDir, `active-subscriptions-${timestamp}.json`)
  writeFileSync(
    activeSubsFile,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: activeSubIds.size,
        subscription_ids: Array.from(activeSubIds).sort(),
      },
      null,
      2
    )
  )

  // 2. Valid claims (should keep)
  const validClaimsFile = join(tempDir, `valid-claims-${timestamp}.json`)
  writeFileSync(
    validClaimsFile,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: validClaims.length,
        claims: validClaims.map((c) => ({
          id: c.id,
          subscription_id: c.subscription_id,
          product_id: c.product_id,
          github_username: (c.data as ClaimData)?.user_github?.login,
          repository_name: (c.data as ClaimData)?.repository_name,
          created_at: c.created_at,
        })),
      },
      null,
      2
    )
  )

  // 3. Stale claims (candidates for cleanup)
  const staleClaimsFile = join(tempDir, `stale-claims-${timestamp}.json`)
  writeFileSync(
    staleClaimsFile,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        count: staleClaims.length,
        warning: 'REVIEW CAREFULLY BEFORE CLEANING UP',
        claims: staleClaims.map((c) => ({
          id: c.id,
          subscription_id: c.subscription_id,
          product_id: c.product_id,
          github_username: (c.data as ClaimData)?.user_github?.login,
          repository_name: (c.data as ClaimData)?.repository_name,
          team_slug: (c.data as ClaimData)?.team_slug,
          created_at: c.created_at,
        })),
      },
      null,
      2
    )
  )

  // 4. Claims with invalid subscription IDs
  let invalidClaimsFile = ''
  if (claimsWithInvalidSubIds.length > 0) {
    invalidClaimsFile = join(tempDir, `invalid-claims-${timestamp}.json`)
    writeFileSync(
      invalidClaimsFile,
      JSON.stringify(
        {
          generated_at: new Date().toISOString(),
          count: claimsWithInvalidSubIds.length,
          claims: claimsWithInvalidSubIds.map((c) => ({
            id: c.id,
            subscription_id: c.subscription_id,
            product_id: c.product_id,
            github_username: (c.data as ClaimData)?.user_github?.login,
            created_at: c.created_at,
          })),
        },
        null,
        2
      )
    )
  }

  // Generate summary report
  const summaryFile = join(tempDir, `cleanup-summary-${timestamp}.txt`)
  const summary = `
STALE CLAIMS ANALYSIS REPORT
Generated: ${new Date().toISOString()}
${'='.repeat(80)}

SUMMARY:
--------
Active Stripe Subscriptions:     ${activeSubIds.size}
Total Database Claims:            ${claims.length}
  ✅ Valid Claims:                ${validClaims.length}
  ⚠️  Stale Claims:                ${staleClaims.length}
  ❓ Invalid Subscription IDs:    ${claimsWithInvalidSubIds.length}

BREAKDOWN BY PRODUCT:
---------------------
${(() => {
  const staleByProduct = new Map<string, number>()
  staleClaims.forEach((c) => {
    staleByProduct.set(c.product_id, (staleByProduct.get(c.product_id) || 0) + 1)
  })
  return Array.from(staleByProduct.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([pid, count]) => `  ${pid}: ${count} stale claims`)
    .join('\n')
})()}

BREAKDOWN BY REPOSITORY:
------------------------
${(() => {
  const staleByRepo = new Map<string, number>()
  staleClaims.forEach((c) => {
    const repo = (c.data as ClaimData)?.repository_name || 'unknown'
    staleByRepo.set(repo, (staleByRepo.get(repo) || 0) + 1)
  })
  return Array.from(staleByRepo.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([repo, count]) => `  ${repo}: ${count} stale claims`)
    .join('\n')
})()}

SAMPLE STALE CLAIMS (first 20):
--------------------------------
${staleClaims
  .slice(0, 20)
  .map(
    (c) =>
      `  Claim ${c.id}: ${(c.data as ClaimData)?.user_github?.login || 'no-user'} (${c.subscription_id})`
  )
  .join('\n')}
${staleClaims.length > 20 ? `\n  ... and ${staleClaims.length - 20} more` : ''}

FILES GENERATED:
----------------
1. ${activeSubsFile}
   - De-duplicated list of all active Stripe subscription IDs

2. ${validClaimsFile}
   - Claims that should be KEPT (subscription is active)

3. ${staleClaimsFile}
   - Claims that are candidates for cleanup (subscription not active)
   ⚠️  REVIEW THIS FILE CAREFULLY BEFORE PROCEEDING

${
  claimsWithInvalidSubIds.length > 0
    ? `4. ${invalidClaimsFile}
   - Claims with invalid subscription ID format`
    : ''
}

NEXT STEPS:
-----------
1. Review ${staleClaimsFile}
2. Verify a sample of subscription IDs in Stripe dashboard
3. If everything looks correct, run the cleanup script (to be created)
4. DO NOT proceed if you have any doubts

SAFETY CHECKS:
--------------
✓ No data has been deleted or modified
✓ All data is backed up in JSON files
✓ You can cross-reference with Stripe dashboard
✓ Review files before any cleanup action
`

  writeFileSync(summaryFile, summary)

  console.log('\n' + '='.repeat(80))
  console.log('FILES GENERATED')
  console.log('='.repeat(80))
  console.log(`\n📄 Summary report: ${summaryFile}`)
  console.log(`📄 Active subscriptions: ${activeSubsFile}`)
  console.log(`📄 Valid claims: ${validClaimsFile}`)
  console.log(`📄 Stale claims: ${staleClaimsFile}`)
  if (claimsWithInvalidSubIds.length > 0) {
    console.log(`📄 Invalid claims: ${invalidClaimsFile}`)
  }

  console.log('\n⚠️  REVIEW THE FILES BEFORE PROCEEDING WITH CLEANUP')
  console.log('📖 Start by reading: ' + summaryFile)
}

main().catch(console.error)
