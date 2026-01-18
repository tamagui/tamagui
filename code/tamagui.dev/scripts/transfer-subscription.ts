/**
 * Transfer Subscription Script
 *
 * This script transfers a subscription from one user to another.
 * Use this when a user logged in with the wrong GitHub account and needs
 * to move their subscription to a new account (with the correct GitHub).
 *
 * Usage (by user ID):
 *   npx tsx scripts/transfer-subscription.ts <old_user_id> <new_user_id>
 *
 * Usage (by GitHub username with --github flag):
 *   npx tsx scripts/transfer-subscription.ts --github <old_github_username> <new_github_username>
 *
 * Examples:
 *   npx tsx scripts/transfer-subscription.ts 1038c400-... abc123-...
 *   npx tsx scripts/transfer-subscription.ts --github tarek-gamal tarekgamal86
 *
 * What this script does:
 * 1. Validates both users exist
 * 2. Transfers all subscriptions from old user to new user
 * 3. Updates Stripe customer mapping
 * 4. Updates claims to point to new user's GitHub
 * 5. Removes old user from GitHub team
 * 6. Adds new user to GitHub team
 * 7. Transfers Discord access if any
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN!
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY!

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables')
  console.error(
    'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function getUser(userId: string) {
  const { data, error } = await supabase.auth.admin.getUserById(userId)
  if (error) throw new Error(`Failed to get user ${userId}: ${error.message}`)
  return data.user
}

async function getUserPrivate(userId: string) {
  const { data, error } = await supabase
    .from('users_private')
    .select('*')
    .eq('id', userId)
    .single()
  if (error)
    throw new Error(`Failed to get users_private for ${userId}: ${error.message}`)
  return data
}

async function getUserByGitHubUsername(githubUsername: string) {
  const { data, error } = await supabase
    .from('users_private')
    .select('*')
    .ilike('github_user_name', githubUsername)
    .single()
  if (error) {
    throw new Error(
      `Failed to find user with GitHub username "${githubUsername}": ${error.message}`
    )
  }
  return data
}

async function getSubscriptions(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
  if (error) throw new Error(`Failed to get subscriptions: ${error.message}`)
  return data
}

async function getClaims(subscriptionId: string) {
  const { data, error } = await supabase
    .from('claims')
    .select('*')
    .eq('subscription_id', subscriptionId)
  if (error) throw new Error(`Failed to get claims: ${error.message}`)
  return data
}

async function getStripeCustomer(userId: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single()
  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to get customer: ${error.message}`)
  }
  return data
}

async function addUserToGitHubTeam(username: string) {
  const response = await fetch(
    `https://api.github.com/orgs/tamagui/teams/early-access/memberships/${username}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to add ${username} to GitHub team: ${error}`)
  }
  return response.json()
}

async function removeUserFromGitHubTeam(username: string) {
  const response = await fetch(
    `https://api.github.com/orgs/tamagui/teams/early-access/memberships/${username}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    }
  )
  // 204 is success, 404 means they weren't in the team
  if (!response.ok && response.status !== 404) {
    const error = await response.text()
    throw new Error(`Failed to remove ${username} from GitHub team: ${error}`)
  }
}

async function transferSubscription(oldUserId: string, newUserId: string) {
  console.info('\n=== Subscription Transfer Script ===\n')

  // 1. Validate users exist
  console.info('1. Validating users...')
  const oldUser = await getUser(oldUserId)
  const newUser = await getUser(newUserId)
  console.info(`   Old user: ${oldUser.email}`)
  console.info(`   New user: ${newUser.email}`)

  // 2. Get users_private records
  console.info('\n2. Getting user private info...')
  const oldUserPrivate = await getUserPrivate(oldUserId)
  const newUserPrivate = await getUserPrivate(newUserId)
  console.info(`   Old GitHub username: ${oldUserPrivate.github_user_name || 'not set'}`)
  console.info(`   New GitHub username: ${newUserPrivate.github_user_name || 'not set'}`)

  if (!newUserPrivate.github_user_name) {
    throw new Error(
      'New user does not have a GitHub username set. They need to login with GitHub first.'
    )
  }

  // 3. Get subscriptions to transfer
  console.info('\n3. Getting subscriptions...')
  const subscriptions = await getSubscriptions(oldUserId)
  console.info(`   Found ${subscriptions.length} subscriptions to transfer`)

  if (subscriptions.length === 0) {
    console.info('   No subscriptions to transfer. Exiting.')
    return
  }

  // 4. Transfer each subscription
  for (const sub of subscriptions) {
    console.info(`\n   Processing subscription: ${sub.id} (status: ${sub.status})`)

    // 4a. Update subscription user_id
    const { error: subError } = await supabase
      .from('subscriptions')
      .update({ user_id: newUserId })
      .eq('id', sub.id)
    if (subError) throw new Error(`Failed to update subscription: ${subError.message}`)
    console.info('   - Updated subscription user_id')

    // 4b. Get and update claims
    const claims = await getClaims(sub.id)
    console.info(`   - Found ${claims.length} claims`)

    for (const claim of claims) {
      // Update claim data with new GitHub info
      const newClaimData = {
        ...(claim.data as object),
        user_github: {
          id: newUser.user_metadata?.provider_id || newUser.id,
          login: newUserPrivate.github_user_name,
        },
      }

      const { error: claimError } = await supabase
        .from('claims')
        .update({ data: newClaimData })
        .eq('id', claim.id)
      if (claimError) throw new Error(`Failed to update claim: ${claimError.message}`)
    }
    console.info('   - Updated claims with new GitHub info')
  }

  // 5. Transfer Stripe customer mapping
  console.info('\n5. Transferring Stripe customer mapping...')
  const oldCustomer = await getStripeCustomer(oldUserId)
  if (oldCustomer) {
    // Check if new user already has a customer record
    const newCustomer = await getStripeCustomer(newUserId)
    if (newCustomer) {
      console.info(
        '   New user already has a Stripe customer. You may need to merge manually in Stripe.'
      )
    } else {
      // Transfer the customer record
      const { error: customerError } = await supabase
        .from('customers')
        .update({ id: newUserId })
        .eq('id', oldUserId)
      if (customerError)
        throw new Error(`Failed to transfer customer: ${customerError.message}`)
      console.info(`   - Transferred Stripe customer ${oldCustomer.stripe_customer_id}`)
    }

    // Also update Stripe customer metadata
    if (STRIPE_SECRET_KEY && oldCustomer.stripe_customer_id) {
      try {
        const response = await fetch(
          `https://api.stripe.com/v1/customers/${oldCustomer.stripe_customer_id}`,
          {
            method: 'POST',
            headers: {
              Authorization: `Basic ${Buffer.from(STRIPE_SECRET_KEY + ':').toString('base64')}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `metadata[supabaseUUID]=${newUserId}`,
          }
        )
        if (response.ok) {
          console.info('   - Updated Stripe customer metadata')
        }
      } catch {
        console.info('   - Warning: Could not update Stripe customer metadata')
      }
    }
  } else {
    console.info('   - No Stripe customer record to transfer')
  }

  // 6. Transfer team_subscriptions if any
  console.info('\n6. Checking team subscriptions...')
  const { data: teamSubs, error: teamSubsError } = await supabase
    .from('team_subscriptions')
    .select('*')
    .eq('owner_id', oldUserId)
  if (!teamSubsError && teamSubs && teamSubs.length > 0) {
    for (const teamSub of teamSubs) {
      const { error } = await supabase
        .from('team_subscriptions')
        .update({ owner_id: newUserId })
        .eq('id', teamSub.id)
      if (error) throw new Error(`Failed to transfer team subscription: ${error.message}`)
    }
    console.info(`   - Transferred ${teamSubs.length} team subscriptions`)
  } else {
    console.info('   - No team subscriptions to transfer')
  }

  // 7. Handle GitHub team membership
  console.info('\n7. Managing GitHub team access...')
  if (oldUserPrivate.github_user_name) {
    await removeUserFromGitHubTeam(oldUserPrivate.github_user_name)
    console.info(`   - Removed ${oldUserPrivate.github_user_name} from GitHub team`)
  }
  const ghResult = await addUserToGitHubTeam(newUserPrivate.github_user_name)
  console.info(
    `   - Added ${newUserPrivate.github_user_name} to GitHub team (state: ${ghResult.state})`
  )

  // 8. Transfer Discord invites
  console.info('\n8. Checking Discord access...')
  for (const sub of subscriptions) {
    const { data: discordInvites, error: discordError } = await supabase
      .from('discord_invites')
      .select('*')
      .eq('subscription_id', sub.id)

    if (!discordError && discordInvites && discordInvites.length > 0) {
      console.info(
        `   - Found ${discordInvites.length} Discord invites (they remain linked to subscription)`
      )
    }
  }

  console.info('\n=== Transfer Complete ===')
  console.info(`\nSummary:`)
  console.info(`  - Transferred ${subscriptions.length} subscriptions`)
  console.info(
    `  - From: ${oldUser.email} (${oldUserPrivate.github_user_name || 'no github'})`
  )
  console.info(`  - To: ${newUser.email} (@${newUserPrivate.github_user_name})`)
  console.info(`\nThe new user should check their GitHub for the team invite.`)
}

function printUsage() {
  console.error('Usage:')
  console.error('  By user ID:')
  console.error(
    '    npx tsx scripts/transfer-subscription.ts <old_user_id> <new_user_id>'
  )
  console.error('')
  console.error('  By GitHub username:')
  console.error(
    '    npx tsx scripts/transfer-subscription.ts --github <old_github_username> <new_github_username>'
  )
  console.error('')
  console.error('Examples:')
  console.error(
    '  npx tsx scripts/transfer-subscription.ts 1038c400-3c3f-4e92-862d-6de0a65a36a1 abc123-new-user-id'
  )
  console.error(
    '  npx tsx scripts/transfer-subscription.ts --github tarek-gamal tarekgamal86'
  )
}

// Main
async function main() {
  const args = process.argv.slice(2)

  if (args.length < 2) {
    printUsage()
    process.exit(1)
  }

  let oldUserId: string
  let newUserId: string

  if (args[0] === '--github' || args[0] === '-g') {
    if (args.length !== 3) {
      printUsage()
      process.exit(1)
    }

    const [, oldGitHub, newGitHub] = args
    console.info(`Looking up users by GitHub username...`)
    console.info(`  Old: ${oldGitHub}`)
    console.info(`  New: ${newGitHub}`)

    const oldUserPrivate = await getUserByGitHubUsername(oldGitHub)
    const newUserPrivate = await getUserByGitHubUsername(newGitHub)

    oldUserId = oldUserPrivate.id
    newUserId = newUserPrivate.id

    console.info(`Found user IDs:`)
    console.info(`  Old: ${oldUserId}`)
    console.info(`  New: ${newUserId}`)
  } else {
    if (args.length !== 2) {
      printUsage()
      process.exit(1)
    }
    ;[oldUserId, newUserId] = args
  }

  await transferSubscription(oldUserId, newUserId)
  console.info('\nDone!')
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
