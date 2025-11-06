#!/usr/bin/env tsx

/**
 * Check if active Stripe subscriptions match GitHub team membership
 *
 * Usage:
 *   tsx scripts/takeout/check-subscription-sync.ts
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN
const TEAM_SLUG = 'early-access'
const ORG_NAME = 'tamagui'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

if (!STRIPE_SECRET_KEY) {
  console.error('Missing STRIPE_SECRET_KEY environment variable')
  process.exit(1)
}

if (!GITHUB_ADMIN_TOKEN) {
  console.error('Missing GITHUB_ADMIN_TOKEN environment variable')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

interface ClaimData {
  claim_type?: string
  repository_name?: string
  user_github?: {
    id: number | string
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

async function getActiveTakeoutClaims() {
  console.log('📊 Fetching active claims from database...')
  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)
    .order('created_at', { ascending: false })
    .limit(10000)

  if (error) {
    console.error('Error fetching claims:', error)
    throw error
  }

  const takeoutClaims = claims?.filter((claim: Claim) => {
    const data = claim.data as ClaimData
    return data?.repository_name === 'takeout'
  }) || []

  return takeoutClaims as Claim[]
}

async function getActiveStripeSubscriptions() {
  console.log('💳 Fetching active Stripe subscriptions...')

  // Get all products to find the takeout product ID
  const products = await stripe.products.list({ limit: 100, active: true })

  console.log(`   Found ${products.data.length} total active products`)
  console.log('   Listing all products:')
  products.data.forEach(p => {
    const metadata = Object.keys(p.metadata).length > 0 ? JSON.stringify(p.metadata) : 'none'
    console.log(`     - ${p.name} (${p.id}) - metadata: ${metadata}`)
  })

  // Products that grant early-access team membership:
  // - Tamagui Pro (includes takeout access)
  // - Takeout Stack (includes unistack repo access)
  const takeoutProducts = products.data.filter(p =>
    p.name.toLowerCase().includes('takeout') ||
    p.name.toLowerCase().includes('tamagui pro') ||
    p.id === 'prod_RlRd2DVrG0frHe' || // Tamagui Pro
    p.id === 'prod_NzLEazaqBgoKnC' || // Takeout Stack
    p.metadata?.type === 'repo' ||
    p.metadata?.includes_takeout === 'true' ||
    p.metadata?.repository === 'takeout' ||
    p.metadata?.repository_name === 'takeout' ||
    p.metadata?.repository_name === 'unistack'
  )

  console.log(`\n   Identified ${takeoutProducts.length} takeout-related products:`)
  takeoutProducts.forEach(p => {
    console.log(`     - ${p.name} (${p.id})`)
  })

  // Get all active subscriptions
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

  // Create a set of takeout product IDs for faster lookup
  const takeoutProductIds = new Set(takeoutProducts.map(p => p.id))

  // Filter for takeout subscriptions
  const takeoutSubscriptions = allSubscriptions.filter(sub => {
    return sub.items.data.some(item => {
      const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id
      return takeoutProductIds.has(productId)
    })
  })

  console.log(`   Found ${takeoutSubscriptions.length} takeout subscriptions`)

  return {
    all: allSubscriptions,
    takeout: takeoutSubscriptions,
    takeoutProducts
  }
}

async function getGitHubTeamMembers() {
  console.log('🐙 Fetching GitHub team members...')

  const allMembers: any[] = []
  let page = 1
  let hasMore = true

  while (hasMore) {
    const response = await fetch(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${TEAM_SLUG}/members?per_page=100&page=${page}`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Failed to fetch team members: ${response.status} ${error}`)
    }

    const members = await response.json()
    allMembers.push(...members)

    hasMore = members.length === 100
    page++
  }

  // Also check pending invitations - with pagination
  const pendingInvitations: any[] = []
  let invitePage = 1
  let hasMoreInvitations = true

  while (hasMoreInvitations) {
    const invitationsResponse = await fetch(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${TEAM_SLUG}/invitations?per_page=100&page=${invitePage}`,
      {
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
      }
    )

    if (invitationsResponse.ok) {
      const invitations = await invitationsResponse.json()
      pendingInvitations.push(...invitations)
      hasMoreInvitations = invitations.length === 100
      invitePage++
    } else {
      hasMoreInvitations = false
    }
  }

  console.log(`   Found ${allMembers.length} active members`)
  console.log(`   Found ${pendingInvitations.length} pending invitations`)

  return {
    active: allMembers,
    pending: pendingInvitations,
    total: allMembers.length + pendingInvitations.length
  }
}

async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('SUBSCRIPTION SYNC CHECK')
  console.log('='.repeat(80) + '\n')

  try {
    // Fetch all data in parallel
    const [claims, stripeData, githubTeam] = await Promise.all([
      getActiveTakeoutClaims(),
      getActiveStripeSubscriptions(),
      getGitHubTeamMembers()
    ])

    console.log('\n' + '='.repeat(80))
    console.log('SUMMARY')
    console.log('='.repeat(80))
    console.log(`\n📊 Database Claims:`)
    console.log(`   Active takeout claims: ${claims.length}`)

    const migratedClaims = claims.filter(c =>
      (c.data as ClaimData)?.team_slug === 'early-access'
    )
    console.log(`   Migrated to team: ${migratedClaims.length}`)
    console.log(`   Not yet migrated: ${claims.length - migratedClaims.length}`)

    console.log(`\n💳 Stripe Subscriptions:`)
    console.log(`   Total active subscriptions: ${stripeData.all.length}`)
    console.log(`   Takeout subscriptions: ${stripeData.takeout.length}`)

    console.log(`\n🐙 GitHub Team (${TEAM_SLUG}):`)
    console.log(`   Active members: ${githubTeam.active.length}`)
    console.log(`   Pending invitations: ${githubTeam.pending.length}`)
    console.log(`   Total: ${githubTeam.total}`)

    console.log('\n' + '='.repeat(80))
    console.log('ANALYSIS')
    console.log('='.repeat(80))

    // Compare numbers
    const claimsVsStripe = claims.length - stripeData.takeout.length
    const githubVsClaims = githubTeam.total - claims.length

    console.log(`\n🔍 Differences:`)
    console.log(`   Database claims vs Stripe subscriptions: ${claimsVsStripe > 0 ? '+' : ''}${claimsVsStripe}`)
    console.log(`   GitHub team vs Database claims: ${githubVsClaims > 0 ? '+' : ''}${githubVsClaims}`)

    if (Math.abs(claimsVsStripe) > 5) {
      console.log('\n⚠️  WARNING: Significant difference between database claims and Stripe subscriptions!')
      console.log('   This could indicate:')
      console.log('   - Subscriptions without claims in the database')
      console.log('   - Claims for cancelled subscriptions')
      console.log('   - Data sync issues')
    }

    if (Math.abs(githubVsClaims) > 5) {
      console.log('\n⚠️  WARNING: Significant difference between GitHub team and database claims!')
      console.log('   This could indicate:')
      console.log('   - Incomplete migration')
      console.log('   - Users manually added/removed from team')
      console.log('   - Pending migrations')
    }

    // List subscription IDs for cross-reference
    console.log(`\n📋 Subscription IDs in database claims:`)
    const claimSubIds = new Set(claims.map(c => c.subscription_id))
    console.log(`   Unique subscription IDs: ${claimSubIds.size}`)

    const stripeSubIds = new Set(stripeData.takeout.map(s => s.id))
    console.log(`\n📋 Active Stripe subscription IDs:`)
    console.log(`   Count: ${stripeSubIds.size}`)

    // Find discrepancies
    const inClaimsNotInStripe = Array.from(claimSubIds).filter(id => !stripeSubIds.has(id))
    const inStripeNotInClaims = Array.from(stripeSubIds).filter(id => !claimSubIds.has(id))

    if (inClaimsNotInStripe.length > 0) {
      console.log(`\n⚠️  Subscriptions in database but NOT in Stripe (${inClaimsNotInStripe.length}):`)
      inClaimsNotInStripe.slice(0, 10).forEach(id => console.log(`   - ${id}`))
      if (inClaimsNotInStripe.length > 10) {
        console.log(`   ... and ${inClaimsNotInStripe.length - 10} more`)
      }
    }

    if (inStripeNotInClaims.length > 0) {
      console.log(`\n⚠️  Subscriptions in Stripe but NOT in database (${inStripeNotInClaims.length}):`)
      inStripeNotInClaims.slice(0, 10).forEach(id => console.log(`   - ${id}`))
      if (inStripeNotInClaims.length > 10) {
        console.log(`   ... and ${inStripeNotInClaims.length - 10} more`)
      }
    }

    console.log('\n' + '='.repeat(80))

    // Return summary for programmatic use
    return {
      claims: claims.length,
      stripeSubscriptions: stripeData.takeout.length,
      githubActive: githubTeam.active.length,
      githubPending: githubTeam.pending.length,
      githubTotal: githubTeam.total,
      differences: {
        claimsVsStripe,
        githubVsClaims
      }
    }

  } catch (error) {
    console.error('\n❌ Error:', error)
    throw error
  }
}

main().catch(console.error)
