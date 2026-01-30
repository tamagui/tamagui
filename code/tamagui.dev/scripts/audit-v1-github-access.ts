/**
 * Audit V1 Subscription GitHub Access
 *
 * This script checks all active V1 subscription users and ensures they have
 * access to the `early-access` GitHub team.
 *
 * Usage:
 *   npx tsx scripts/audit-v1-github-access.ts           # dry run - just list users
 *   npx tsx scripts/audit-v1-github-access.ts --fix     # actually send invites
 *
 * What this script does:
 * 1. Finds all users with active V1 subscriptions (TamaguiPro, TamaguiProTeamSeats)
 * 2. Checks their GitHub team membership status
 * 3. With --fix: Sends GitHub team invites to users who don't have access
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables')
  console.error(
    'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set'
  )
  process.exit(1)
}

if (!GITHUB_ADMIN_TOKEN) {
  console.error('Missing GITHUB_ADMIN_TOKEN')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// V1 Pro product IDs
const V1_PRO_PRODUCT_IDS = [
  'prod_RlRd2DVrG0frHe', // TamaguiPro
  'prod_Rxu0x7jR0nWJSv', // TamaguiProTeamSeats
]

interface UserSubscriptionInfo {
  userId: string
  email: string | null
  githubUsername: string | null
  subscriptionId: string
  subscriptionStatus: string
  productName: string
  currentPeriodEnd: string
}

async function getActiveV1Subscriptions(): Promise<UserSubscriptionInfo[]> {
  // get all active subscriptions with their items
  const { data: subscriptions, error } = await supabase
    .from('subscriptions')
    .select(`
      id,
      user_id,
      status,
      current_period_end,
      subscription_items (
        price_id,
        prices (
          id,
          product_id,
          products (
            id,
            name
          )
        )
      )
    `)
    .in('status', ['active', 'trialing'])

  if (error) {
    throw new Error(`Failed to get subscriptions: ${error.message}`)
  }

  const v1Subscriptions: UserSubscriptionInfo[] = []

  for (const sub of subscriptions || []) {
    // check if this subscription has a V1 Pro product
    const items = sub.subscription_items as any[]
    if (!items) continue

    for (const item of items) {
      const product = item.prices?.products
      if (!product) continue

      if (V1_PRO_PRODUCT_IDS.includes(product.id)) {
        // get user info
        const { data: user } = await supabase.auth.admin.getUserById(sub.user_id)
        const { data: userPrivate } = await supabase
          .from('users_private')
          .select('github_user_name')
          .eq('id', sub.user_id)
          .single()

        v1Subscriptions.push({
          userId: sub.user_id,
          email: user?.user?.email || null,
          githubUsername: userPrivate?.github_user_name || null,
          subscriptionId: sub.id,
          subscriptionStatus: sub.status,
          productName: product.name,
          currentPeriodEnd: sub.current_period_end,
        })
        break // only count once per subscription
      }
    }
  }

  return v1Subscriptions
}

async function checkGitHubTeamMembership(
  username: string
): Promise<{ isMember: boolean; state?: 'active' | 'pending' }> {
  const response = await fetch(
    `https://api.github.com/orgs/tamagui/teams/early-access/memberships/${username}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )

  if (response.status === 200) {
    const data = await response.json()
    return { isMember: true, state: data.state }
  } else if (response.status === 404) {
    return { isMember: false }
  } else {
    const error = await response.text()
    console.error(`Error checking membership for ${username}: ${error}`)
    return { isMember: false }
  }
}

async function addUserToGitHubTeam(
  username: string
): Promise<{ success: boolean; state?: string; error?: string }> {
  const response = await fetch(
    `https://api.github.com/orgs/tamagui/teams/early-access/memberships/${username}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify({ role: 'member' }),
    }
  )

  if (response.ok) {
    const data = await response.json()
    return { success: true, state: data.state }
  } else {
    const error = await response.text()
    return { success: false, error }
  }
}

async function main() {
  const args = process.argv.slice(2)
  const shouldFix = args.includes('--fix')

  console.info('\n=== V1 Subscription GitHub Access Audit ===\n')
  console.info(`Mode: ${shouldFix ? 'FIX (will send invites)' : 'DRY RUN (read only)'}\n`)

  // get all active V1 subscriptions
  console.info('Fetching active V1 subscriptions...')
  const v1Users = await getActiveV1Subscriptions()
  console.info(`Found ${v1Users.length} active V1 subscriptions\n`)

  // categorize users
  const usersWithGithub: UserSubscriptionInfo[] = []
  const usersWithoutGithub: UserSubscriptionInfo[] = []

  for (const user of v1Users) {
    if (user.githubUsername) {
      usersWithGithub.push(user)
    } else {
      usersWithoutGithub.push(user)
    }
  }

  // check GitHub team membership for users with GitHub usernames
  console.info('Checking GitHub team membership...\n')

  const hasAccess: (UserSubscriptionInfo & { state: string })[] = []
  const needsInvite: UserSubscriptionInfo[] = []
  const pendingInvite: UserSubscriptionInfo[] = []

  for (const user of usersWithGithub) {
    const membership = await checkGitHubTeamMembership(user.githubUsername!)
    if (membership.isMember && membership.state === 'active') {
      hasAccess.push({ ...user, state: 'active' })
    } else if (membership.isMember && membership.state === 'pending') {
      pendingInvite.push(user)
    } else {
      needsInvite.push(user)
    }
  }

  // print results
  console.info('=== RESULTS ===\n')

  console.info(`✅ Already have access (${hasAccess.length}):`)
  for (const user of hasAccess) {
    console.info(`   @${user.githubUsername} - ${user.email} (${user.productName})`)
  }

  console.info(`\n⏳ Pending invite (${pendingInvite.length}):`)
  for (const user of pendingInvite) {
    console.info(`   @${user.githubUsername} - ${user.email} (${user.productName})`)
  }

  console.info(`\n❌ Need invite (${needsInvite.length}):`)
  for (const user of needsInvite) {
    console.info(`   @${user.githubUsername} - ${user.email} (${user.productName})`)
  }

  console.info(`\n⚠️  No GitHub username (${usersWithoutGithub.length}):`)
  for (const user of usersWithoutGithub) {
    console.info(`   ${user.email} (${user.productName}) - expires: ${user.currentPeriodEnd}`)
  }

  // send invites if --fix flag is set
  if (shouldFix && needsInvite.length > 0) {
    console.info(`\n=== SENDING INVITES ===\n`)

    for (const user of needsInvite) {
      console.info(`Inviting @${user.githubUsername}...`)
      const result = await addUserToGitHubTeam(user.githubUsername!)
      if (result.success) {
        console.info(`   ✅ Invite sent (state: ${result.state})`)
      } else {
        console.info(`   ❌ Failed: ${result.error}`)
      }
    }
  } else if (needsInvite.length > 0) {
    console.info(`\nRun with --fix to send invites to ${needsInvite.length} users`)
  }

  // summary
  console.info('\n=== SUMMARY ===')
  console.info(`Total V1 subscriptions: ${v1Users.length}`)
  console.info(`  - With GitHub access: ${hasAccess.length}`)
  console.info(`  - Pending invite: ${pendingInvite.length}`)
  console.info(`  - Need invite: ${needsInvite.length}`)
  console.info(`  - No GitHub username: ${usersWithoutGithub.length}`)
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
