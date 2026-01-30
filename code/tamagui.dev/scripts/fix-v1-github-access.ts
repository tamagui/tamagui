/**
 * Fix V1 Subscription GitHub Access
 *
 * This script checks all active V1 subscription users and ensures they have
 * access to the `early-access` GitHub team.
 *
 * Usage:
 *   npx tsx scripts/fix-v1-github-access.ts              # dry run - audit only
 *   npx tsx scripts/fix-v1-github-access.ts --fix        # send invites
 *
 * What this script does:
 * 1. Finds all users with active V1 subscriptions (TamaguiPro, TamaguiProTeamSeats)
 * 2. Checks their GitHub team membership status
 * 3. Validates GitHub usernames actually exist
 * 4. With --fix: Sends GitHub team invites to valid users who don't have access
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
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

// rate limit helper
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function getActiveV1Subscriptions(): Promise<UserSubscriptionInfo[]> {
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
  const seenUserIds = new Set<string>()

  for (const sub of subscriptions || []) {
    // skip if we already processed this user (they might have multiple subs)
    if (seenUserIds.has(sub.user_id)) continue

    const items = sub.subscription_items as any[]
    if (!items) continue

    for (const item of items) {
      const product = item.prices?.products
      if (!product) continue

      if (V1_PRO_PRODUCT_IDS.includes(product.id)) {
        seenUserIds.add(sub.user_id)

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
        break
      }
    }
  }

  return v1Subscriptions
}

async function checkGitHubUserExists(username: string): Promise<boolean> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
      Accept: 'application/vnd.github+json',
    },
  })
  return response.status === 200
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
    console.error(`  Error checking membership for ${username}: ${error}`)
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

  console.info('\n=== V1 Subscription GitHub Access Fix ===\n')
  console.info(`Mode: ${shouldFix ? 'FIX (will send invites)' : 'DRY RUN (audit only)'}\n`)

  // get all active V1 subscriptions
  console.info('Fetching active V1 subscriptions...')
  const v1Users = await getActiveV1Subscriptions()
  console.info(`Found ${v1Users.length} unique active V1 users\n`)

  // categorize users
  const usersWithGithub = v1Users.filter((u) => u.githubUsername)
  const usersWithoutGithub = v1Users.filter((u) => !u.githubUsername)

  console.info(`Users with GitHub username: ${usersWithGithub.length}`)
  console.info(`Users without GitHub username: ${usersWithoutGithub.length}`)
  console.info('\nChecking GitHub accounts and team membership...\n')

  const hasAccess: (UserSubscriptionInfo & { state: string })[] = []
  const needsInvite: UserSubscriptionInfo[] = []
  const pendingInvite: UserSubscriptionInfo[] = []
  const invalidGithub: UserSubscriptionInfo[] = []

  let processed = 0
  for (const user of usersWithGithub) {
    processed++
    if (processed % 50 === 0) {
      console.info(`  Processed ${processed}/${usersWithGithub.length}...`)
    }

    // first check if GitHub user exists
    const exists = await checkGitHubUserExists(user.githubUsername!)
    if (!exists) {
      invalidGithub.push(user)
      await sleep(100) // rate limit
      continue
    }

    // check team membership
    const membership = await checkGitHubTeamMembership(user.githubUsername!)
    if (membership.isMember && membership.state === 'active') {
      hasAccess.push({ ...user, state: 'active' })
    } else if (membership.isMember && membership.state === 'pending') {
      pendingInvite.push(user)
    } else {
      needsInvite.push(user)
    }

    await sleep(100) // rate limit
  }

  // print results
  console.info('\n=== RESULTS ===\n')

  console.info(`✅ Already have access (${hasAccess.length}):`)
  if (hasAccess.length <= 20) {
    for (const user of hasAccess) {
      console.info(`   @${user.githubUsername} - ${user.email}`)
    }
  } else {
    console.info(`   (showing first 10)`)
    for (const user of hasAccess.slice(0, 10)) {
      console.info(`   @${user.githubUsername} - ${user.email}`)
    }
  }

  console.info(`\n⏳ Pending invite (${pendingInvite.length}):`)
  for (const user of pendingInvite) {
    console.info(`   @${user.githubUsername} - ${user.email}`)
  }

  console.info(`\n❌ Need invite (${needsInvite.length}):`)
  if (needsInvite.length <= 30) {
    for (const user of needsInvite) {
      console.info(`   @${user.githubUsername} - ${user.email}`)
    }
  } else {
    console.info(`   (showing first 20)`)
    for (const user of needsInvite.slice(0, 20)) {
      console.info(`   @${user.githubUsername} - ${user.email}`)
    }
    console.info(`   ... and ${needsInvite.length - 20} more`)
  }

  console.info(`\n🚫 Invalid GitHub username (${invalidGithub.length}):`)
  for (const user of invalidGithub) {
    console.info(`   @${user.githubUsername} - ${user.email} (account doesn't exist)`)
  }

  console.info(`\n⚠️  No GitHub username linked (${usersWithoutGithub.length}):`)
  if (usersWithoutGithub.length <= 20) {
    for (const user of usersWithoutGithub) {
      console.info(`   ${user.email}`)
    }
  } else {
    console.info(`   (${usersWithoutGithub.length} users - mostly test accounts)`)
  }

  // send invites if --fix flag is set
  if (shouldFix && needsInvite.length > 0) {
    console.info(`\n=== SENDING INVITES TO ${needsInvite.length} USERS ===\n`)

    let successful = 0
    let failed = 0

    for (const user of needsInvite) {
      process.stdout.write(`Inviting @${user.githubUsername}... `)
      const result = await addUserToGitHubTeam(user.githubUsername!)
      if (result.success) {
        console.info(`✅ (${result.state})`)
        successful++
      } else {
        console.info(`❌ ${result.error}`)
        failed++
      }
      await sleep(200) // rate limit for writes
    }

    console.info(`\nInvites sent: ${successful} successful, ${failed} failed`)
  } else if (needsInvite.length > 0) {
    console.info(`\n👉 Run with --fix to send invites to ${needsInvite.length} users`)
  }

  // summary
  console.info('\n=== SUMMARY ===')
  console.info(`Total active V1 users: ${v1Users.length}`)
  console.info(`  ✅ Already have access: ${hasAccess.length}`)
  console.info(`  ⏳ Pending invite: ${pendingInvite.length}`)
  console.info(`  ❌ Need invite: ${needsInvite.length}`)
  console.info(`  🚫 Invalid GitHub username: ${invalidGithub.length}`)
  console.info(`  ⚠️  No GitHub username: ${usersWithoutGithub.length}`)
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
