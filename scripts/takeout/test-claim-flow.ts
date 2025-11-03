#!/usr/bin/env tsx

/**
 * Test the full claim flow with team-based access
 *
 * This script simulates what happens when a user claims their Tamagui Pro subscription
 *
 * Usage:
 *   tsx scripts/takeout/test-claim-flow.ts <github-username>
 */

import { createClient } from '@supabase/supabase-js'
import { addUserToTeam, removeUserFromTeam, checkIfUserIsTeamMember } from '../../code/tamagui.dev/features/github/helpers'

const TEAM_SLUG = 'early-access'
const ORG_NAME = 'tamagui'

async function testClaimFlow(username: string) {
  console.log('='.repeat(80))
  console.log(`Testing claim flow for: ${username}`)
  console.log('='.repeat(80))

  // Step 1: Check current status
  console.log('\n1. Checking current team membership...')
  const initialCheck = await checkIfUserIsTeamMember(TEAM_SLUG, username, ORG_NAME)
  console.log(`   Status: ${initialCheck.isMember ? `Member (${initialCheck.state})` : 'Not a member'}`)

  // Step 2: Add to team (simulating claim)
  console.log('\n2. Adding user to team (simulating claim)...')
  try {
    await addUserToTeam(TEAM_SLUG, username, ORG_NAME)
    console.log('   ✅ Successfully added to team')
  } catch (error) {
    console.error('   ❌ Failed to add to team:', error)
    return
  }

  // Step 3: Verify membership
  console.log('\n3. Verifying team membership...')
  const verifyCheck = await checkIfUserIsTeamMember(TEAM_SLUG, username, ORG_NAME)
  if (verifyCheck.isMember) {
    console.log(`   ✅ Confirmed member (state: ${verifyCheck.state}, role: ${verifyCheck.role})`)
  } else {
    console.log('   ❌ User is not a member - something went wrong!')
  }

  // Step 4: Remove from team (simulating unclaim)
  console.log('\n4. Removing user from team (simulating unclaim)...')
  try {
    await removeUserFromTeam(TEAM_SLUG, username, ORG_NAME)
    console.log('   ✅ Successfully removed from team')
  } catch (error) {
    console.error('   ❌ Failed to remove from team:', error)
    return
  }

  // Step 5: Verify removal
  console.log('\n5. Verifying removal...')
  const finalCheck = await checkIfUserIsTeamMember(TEAM_SLUG, username, ORG_NAME)
  if (!finalCheck.isMember) {
    console.log('   ✅ Confirmed not a member')
  } else {
    console.log(`   ⚠️  User is still a member (state: ${finalCheck.state})`)
  }

  console.log('\n' + '='.repeat(80))
  console.log('Test completed!')
  console.log('='.repeat(80))
}

async function main() {
  const username = process.argv[2]

  if (!username) {
    console.log('Usage: tsx scripts/takeout/test-claim-flow.ts <github-username>')
    process.exit(1)
  }

  await testClaimFlow(username)
}

main().catch(console.error)
