#!/usr/bin/env tsx

/**
 * Migration script to move users from direct repo collaborator access to team-based access
 *
 * Usage:
 *   # Test with a single user
 *   tsx scripts/takeout/migrate-to-team.ts --test-user <github-username>
 *
 *   # Migrate all active users
 *   tsx scripts/takeout/migrate-to-team.ts --all
 *
 *   # Dry run (doesn't make changes)
 *   tsx scripts/takeout/migrate-to-team.ts --all --dry-run
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN
const TEAM_SLUG = 'early-access'
const ORG_NAME = 'tamagui'

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

if (!GITHUB_ADMIN_TOKEN) {
  console.error('Missing GITHUB_ADMIN_TOKEN environment variable')
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
}

interface Claim {
  id: number
  subscription_id: string
  product_id: string
  data: ClaimData
  created_at: string
  unclaimed_at: string | null
}

async function addUserToTeam(username: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Adding ${username} to team ${TEAM_SLUG}...`)

  if (dryRun) {
    console.log(`  Would call: gh api /orgs/${ORG_NAME}/teams/${TEAM_SLUG}/memberships/${username}`)
    return true
  }

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${TEAM_SLUG}/memberships/${username}`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({
          role: 'member'
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error(`  ❌ Failed to add ${username}: ${response.status} ${error}`)
      return false
    }

    const data = await response.json()
    console.log(`  ✅ Successfully added ${username} (state: ${data.state})`)
    return true
  } catch (error) {
    console.error(`  ❌ Error adding ${username}:`, error)
    return false
  }
}

async function removeCollaboratorAccess(repoName: string, username: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Removing ${username} from ${repoName} collaborators...`)

  if (dryRun) {
    console.log(`  Would call: gh api /repos/${ORG_NAME}/${repoName}/collaborators/${username} -X DELETE`)
    return true
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${ORG_NAME}/${repoName}/collaborators/${username}`,
      {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
      }
    )

    if (response.status === 204) {
      console.log(`  ✅ Successfully removed ${username} from ${repoName}`)
      return true
    } else if (response.status === 404) {
      console.log(`  ℹ️  ${username} was not a collaborator on ${repoName}`)
      return true
    } else {
      const error = await response.text()
      console.error(`  ❌ Failed to remove ${username}: ${response.status} ${error}`)
      return false
    }
  } catch (error) {
    console.error(`  ❌ Error removing ${username}:`, error)
    return false
  }
}

async function updateClaimToTeamBased(claimId: number, githubUsername: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}Updating claim ${claimId} to team-based access...`)

  if (dryRun) {
    console.log(`  Would update claim data to include team_slug`)
    return true
  }

  try {
    const { data: claim, error: fetchError } = await supabase
      .from('claims')
      .select('data')
      .eq('id', claimId)
      .single()

    if (fetchError) {
      console.error(`  ❌ Failed to fetch claim:`, fetchError)
      return false
    }

    const updatedData = {
      ...claim.data,
      team_slug: TEAM_SLUG,
      migrated_at: new Date().toISOString(),
    }

    const { error: updateError } = await supabase
      .from('claims')
      .update({ data: updatedData })
      .eq('id', claimId)

    if (updateError) {
      console.error(`  ❌ Failed to update claim:`, updateError)
      return false
    }

    console.log(`  ✅ Updated claim ${claimId}`)
    return true
  } catch (error) {
    console.error(`  ❌ Error updating claim:`, error)
    return false
  }
}

async function migrateSingleUser(username: string, dryRun = false) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Migrating user: ${username}`)
  console.log('='.repeat(60))

  // Find the claim for this user
  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)

  if (error) {
    console.error('Error fetching claims:', error)
    return
  }

  const userClaim = claims?.find((claim: Claim) => {
    const data = claim.data as ClaimData
    return data?.user_github?.login === username && data?.repository_name === 'takeout'
  })

  if (!userClaim) {
    console.error(`❌ No active claim found for user ${username}`)
    return
  }

  console.log(`Found claim ID: ${userClaim.id}`)
  console.log(`Created at: ${userClaim.created_at}`)

  // Step 1: Add user to team
  const teamAdded = await addUserToTeam(username, dryRun)
  if (!teamAdded) {
    console.error('❌ Failed to add user to team, stopping migration')
    return
  }

  // Step 2: Update claim record (skipping collaborator removal - users can have both)
  const claimUpdated = await updateClaimToTeamBased(userClaim.id, username, dryRun)
  if (!claimUpdated) {
    console.error('❌ Failed to update claim record')
    return
  }

  console.log('\n✅ Migration completed successfully!')
}

async function migrateAllUsers(dryRun = false) {
  console.log(`\n${'='.repeat(60)}`)
  console.log(`Migrating all active takeout subscribers to team-based access`)
  console.log(`Dry run: ${dryRun}`)
  console.log('='.repeat(60))

  // Fetch all active claims for takeout repo
  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)

  if (error) {
    console.error('Error fetching claims:', error)
    return
  }

  const takeoutClaims = claims?.filter((claim: Claim) => {
    const data = claim.data as ClaimData
    return data?.repository_name === 'takeout' && data?.user_github?.login
  }) || []

  console.log(`\nFound ${takeoutClaims.length} active takeout claims to migrate\n`)

  const results = {
    success: 0,
    failed: 0,
    usernames: [] as string[]
  }

  for (const claim of takeoutClaims) {
    const data = claim.data as ClaimData
    const username = data.user_github!.login

    console.log(`\n--- Processing ${username} (claim ${claim.id}) ---`)

    try {
      // Step 1: Add to team
      const teamAdded = await addUserToTeam(username, dryRun)
      if (!teamAdded) {
        console.error(`❌ Failed to add ${username} to team`)
        results.failed++
        continue
      }

      // Step 2: Update claim (skipping collaborator removal - users can have both)
      const claimUpdated = await updateClaimToTeamBased(claim.id, username, dryRun)
      if (!claimUpdated) {
        console.error(`⚠️  Warning: ${username} added to team but claim not updated`)
      }

      results.success++
      results.usernames.push(username)
    } catch (error) {
      console.error(`❌ Error processing ${username}:`, error)
      results.failed++
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log('Migration Summary')
  console.log('='.repeat(60))
  console.log(`Total claims: ${takeoutClaims.length}`)
  console.log(`Successful: ${results.success}`)
  console.log(`Failed: ${results.failed}`)
  console.log(`\nMigrated users:`)
  results.usernames.forEach(u => console.log(`  - ${u}`))
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const testUserIndex = args.indexOf('--test-user')
  const all = args.includes('--all')

  if (testUserIndex !== -1 && args[testUserIndex + 1]) {
    const username = args[testUserIndex + 1]
    await migrateSingleUser(username, dryRun)
  } else if (all) {
    await migrateAllUsers(dryRun)
  } else {
    console.log('Usage:')
    console.log('  tsx scripts/takeout/migrate-to-team.ts --test-user <github-username> [--dry-run]')
    console.log('  tsx scripts/takeout/migrate-to-team.ts --all [--dry-run]')
    process.exit(1)
  }
}

main().catch(console.error)
