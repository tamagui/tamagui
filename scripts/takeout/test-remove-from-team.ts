#!/usr/bin/env tsx

/**
 * Test script to remove a single user from the early-access team
 *
 * Usage:
 *   tsx scripts/takeout/test-remove-from-team.ts <github-username>
 */

const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN
const TEAM_SLUG = 'early-access'
const ORG_NAME = 'tamagui'

if (!GITHUB_ADMIN_TOKEN) {
  console.error('Missing GITHUB_ADMIN_TOKEN environment variable')
  process.exit(1)
}

async function removeUserFromTeam(username: string): Promise<void> {
  console.log(`Removing ${username} from team ${ORG_NAME}/${TEAM_SLUG}...`)

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${TEAM_SLUG}/memberships/${username}`,
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
      console.log('\n✅ Successfully removed from team!')
    } else if (response.status === 404) {
      console.log('\nℹ️  User was not a member of the team')
    } else {
      const error = await response.text()
      console.error(`❌ Failed: ${response.status} ${response.statusText}`)
      console.error(error)
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ Error:', error)
    process.exit(1)
  }
}

async function checkTeamMembership(username: string): Promise<void> {
  console.log(`\nChecking if ${username} is a member...`)

  try {
    const response = await fetch(
      `https://api.github.com/orgs/${ORG_NAME}/teams/${TEAM_SLUG}/memberships/${username}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        }
      }
    )

    if (response.status === 200) {
      const data = await response.json()
      console.log(`✓ Currently a member (state: ${data.state}, role: ${data.role})`)
    } else if (response.status === 404) {
      console.log('✓ Not a member')
    } else {
      console.log(`? Status: ${response.status}`)
    }
  } catch (error) {
    console.log('? Could not check membership')
  }
}

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log('Usage: tsx scripts/takeout/test-remove-from-team.ts <github-username>')
    process.exit(1)
  }

  console.log('='.repeat(60))
  console.log(`Testing: Remove user from team`)
  console.log('='.repeat(60))

  await checkTeamMembership(username)
  await removeUserFromTeam(username)
  await checkTeamMembership(username)
}

main().catch(console.error)
