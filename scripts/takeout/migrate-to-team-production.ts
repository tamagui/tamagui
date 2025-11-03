#!/usr/bin/env tsx

/**
 * PRODUCTION Migration script to move users from direct repo collaborator access to team-based access
 *
 * Features:
 * - Rate limiting to avoid GitHub API limits
 * - Chunking/batching for large datasets
 * - Progress tracking and resume capability
 * - Detailed logging
 * - Error recovery
 *
 * Usage:
 *   # Test with a single user
 *   tsx scripts/takeout/migrate-to-team-production.ts --test-user <github-username>
 *
 *   # Migrate in batches
 *   tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50
 *
 *   # Resume from where it left off
 *   tsx scripts/takeout/migrate-to-team-production.ts --resume
 *
 *   # Dry run
 *   tsx scripts/takeout/migrate-to-team-production.ts --batch-size 50 --dry-run
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN
const TEAM_SLUG = 'early-access'
const ORG_NAME = 'tamagui'

// Rate limiting configuration
const GITHUB_API_RATE_LIMIT = 5000 // 5000 requests per hour
const DELAY_BETWEEN_REQUESTS_MS = 750 // ~1.3 seconds = ~2700 requests/hour (conservative)
const BATCH_SIZE = 50 // Process 50 users at a time
const PROGRESS_FILE = join(process.cwd(), 'scripts/takeout/.migration-progress.json')

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

interface ProgressData {
  processedUsernames: Set<string>
  processedClaimIds: Set<number>
  successCount: number
  failureCount: number
  skippedCount: number
  startTime: string
  lastUpdateTime: string
}

interface MigrationResult {
  username: string
  claimId: number
  success: boolean
  error?: string
  skipped?: boolean
  skipReason?: string
}

// Utility to delay between API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Load progress from file
function loadProgress(): ProgressData {
  if (existsSync(PROGRESS_FILE)) {
    try {
      const data = JSON.parse(readFileSync(PROGRESS_FILE, 'utf-8'))
      return {
        processedUsernames: new Set(data.processedUsernames || []),
        processedClaimIds: new Set(data.processedClaimIds || []),
        successCount: data.successCount || 0,
        failureCount: data.failureCount || 0,
        skippedCount: data.skippedCount || 0,
        startTime: data.startTime || new Date().toISOString(),
        lastUpdateTime: data.lastUpdateTime || new Date().toISOString(),
      }
    } catch (error) {
      console.warn('Could not load progress file, starting fresh')
    }
  }
  return {
    processedUsernames: new Set(),
    processedClaimIds: new Set(),
    successCount: 0,
    failureCount: 0,
    skippedCount: 0,
    startTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString(),
  }
}

// Save progress to file
function saveProgress(progress: ProgressData) {
  const data = {
    processedUsernames: Array.from(progress.processedUsernames),
    processedClaimIds: Array.from(progress.processedClaimIds),
    successCount: progress.successCount,
    failureCount: progress.failureCount,
    skippedCount: progress.skippedCount,
    startTime: progress.startTime,
    lastUpdateTime: new Date().toISOString(),
  }
  writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2))
}

async function addUserToTeam(username: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}  Adding ${username} to team ${TEAM_SLUG}...`)

  if (dryRun) {
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
        body: JSON.stringify({ role: 'member' })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error(`    ❌ Failed: ${response.status} ${error}`)
      return false
    }

    const data = await response.json()
    console.log(`    ✅ Added (state: ${data.state})`)
    return true
  } catch (error) {
    console.error(`    ❌ Error:`, error)
    return false
  }
}

async function removeCollaboratorAccess(repoName: string, username: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}  Removing ${username} from ${repoName} collaborators...`)

  if (dryRun) {
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
      console.log(`    ✅ Removed`)
      return true
    } else if (response.status === 404) {
      console.log(`    ℹ️  Not a collaborator`)
      return true
    } else {
      const error = await response.text()
      console.error(`    ❌ Failed: ${response.status} ${error}`)
      return false
    }
  } catch (error) {
    console.error(`    ❌ Error:`, error)
    return false
  }
}

async function updateClaimToTeamBased(claimId: number, githubUsername: string, dryRun = false): Promise<boolean> {
  console.log(`${dryRun ? '[DRY RUN] ' : ''}  Updating claim ${claimId}...`)

  if (dryRun) {
    return true
  }

  try {
    const { data: claim, error: fetchError } = await supabase
      .from('claims')
      .select('data')
      .eq('id', claimId)
      .single()

    if (fetchError) {
      console.error(`    ❌ Failed to fetch claim:`, fetchError)
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
      console.error(`    ❌ Failed to update claim:`, updateError)
      return false
    }

    console.log(`    ✅ Updated`)
    return true
  } catch (error) {
    console.error(`    ❌ Error:`, error)
    return false
  }
}

async function migrateUser(claim: Claim, dryRun = false): Promise<MigrationResult> {
  const data = claim.data as ClaimData
  const username = data.user_github?.login

  if (!username) {
    return {
      username: 'unknown',
      claimId: claim.id,
      success: false,
      error: 'No GitHub username in claim data'
    }
  }

  // Check if already migrated
  if (data.team_slug === TEAM_SLUG) {
    return {
      username,
      claimId: claim.id,
      success: true,
      skipped: true,
      skipReason: 'Already migrated'
    }
  }

  console.log(`\nMigrating ${username} (claim ${claim.id})...`)

  try {
    // Step 1: Add to team
    const teamAdded = await addUserToTeam(username, dryRun)
    if (!teamAdded) {
      return {
        username,
        claimId: claim.id,
        success: false,
        error: 'Failed to add to team'
      }
    }

    await delay(DELAY_BETWEEN_REQUESTS_MS)

    // Step 2: Remove from repo
    await removeCollaboratorAccess('takeout', username, dryRun)
    await delay(DELAY_BETWEEN_REQUESTS_MS)

    // Step 3: Update claim
    const claimUpdated = await updateClaimToTeamBased(claim.id, username, dryRun)
    if (!claimUpdated) {
      console.log(`  ⚠️  Warning: Added to team but claim not updated`)
    }

    return {
      username,
      claimId: claim.id,
      success: true
    }
  } catch (error) {
    return {
      username,
      claimId: claim.id,
      success: false,
      error: String(error)
    }
  }
}

async function migrateBatch(claims: Claim[], dryRun = false, progress: ProgressData): Promise<void> {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`Processing batch of ${claims.length} claims`)
  console.log('='.repeat(80))

  for (const claim of claims) {
    const data = claim.data as ClaimData
    const username = data.user_github?.login || 'unknown'

    // Skip if already processed
    if (progress.processedClaimIds.has(claim.id)) {
      console.log(`\n⏭️  Skipping ${username} (claim ${claim.id}) - already processed`)
      continue
    }

    const result = await migrateUser(claim, dryRun)

    // Update progress
    progress.processedClaimIds.add(claim.id)
    progress.processedUsernames.add(username)

    if (result.skipped) {
      progress.skippedCount++
      console.log(`  ⏭️  Skipped: ${result.skipReason}`)
    } else if (result.success) {
      progress.successCount++
      console.log(`  ✅ Success`)
    } else {
      progress.failureCount++
      console.log(`  ❌ Failed: ${result.error}`)
    }

    // Save progress after each user
    if (!dryRun) {
      saveProgress(progress)
    }

    // Rate limiting delay
    await delay(DELAY_BETWEEN_REQUESTS_MS)
  }
}

async function migrateAll(dryRun = false, batchSize = BATCH_SIZE, resume = false) {
  console.log(`\n${'='.repeat(80)}`)
  console.log(`PRODUCTION MIGRATION: Team-Based Access`)
  console.log('='.repeat(80))
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'PRODUCTION'}`)
  console.log(`Batch size: ${batchSize}`)
  console.log(`Rate limit: ${DELAY_BETWEEN_REQUESTS_MS}ms between requests`)
  console.log(`Resume: ${resume}`)
  console.log('='.repeat(80))

  // Load progress
  const progress = resume ? loadProgress() : {
    processedUsernames: new Set<string>(),
    processedClaimIds: new Set<number>(),
    successCount: 0,
    failureCount: 0,
    skippedCount: 0,
    startTime: new Date().toISOString(),
    lastUpdateTime: new Date().toISOString(),
  }

  if (resume && progress.processedClaimIds.size > 0) {
    console.log(`\nResuming from previous run:`)
    console.log(`  Already processed: ${progress.processedClaimIds.size} claims`)
    console.log(`  Success: ${progress.successCount}`)
    console.log(`  Failed: ${progress.failureCount}`)
    console.log(`  Skipped: ${progress.skippedCount}`)
    console.log('')
  }

  // Fetch all active claims
  console.log('Fetching active claims...')
  const { data: claims, error } = await supabase
    .from('claims')
    .select('*')
    .is('unclaimed_at', null)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching claims:', error)
    process.exit(1)
  }

  const takeoutClaims = (claims || []).filter((claim: Claim) => {
    const data = claim.data as ClaimData
    return data?.repository_name === 'takeout' && data?.user_github?.login
  })

  console.log(`Found ${takeoutClaims.length} total takeout claims`)

  // Filter out already processed
  const unprocessedClaims = takeoutClaims.filter((claim: Claim) =>
    !progress.processedClaimIds.has(claim.id)
  )

  console.log(`Unprocessed: ${unprocessedClaims.length} claims`)
  console.log('')

  if (unprocessedClaims.length === 0) {
    console.log('✅ All claims already processed!')
    return
  }

  // Process in batches
  const batches = []
  for (let i = 0; i < unprocessedClaims.length; i += batchSize) {
    batches.push(unprocessedClaims.slice(i, i + batchSize))
  }

  console.log(`Will process ${batches.length} batches`)
  console.log('')

  for (let i = 0; i < batches.length; i++) {
    console.log(`\n📦 Batch ${i + 1}/${batches.length}`)
    await migrateBatch(batches[i], dryRun, progress)

    // Progress summary after each batch
    const totalProcessed = progress.successCount + progress.failureCount + progress.skippedCount
    const percentComplete = ((totalProcessed / takeoutClaims.length) * 100).toFixed(1)

    console.log(`\n📊 Progress: ${totalProcessed}/${takeoutClaims.length} (${percentComplete}%)`)
    console.log(`   ✅ Success: ${progress.successCount}`)
    console.log(`   ❌ Failed: ${progress.failureCount}`)
    console.log(`   ⏭️  Skipped: ${progress.skippedCount}`)

    // Pause between batches for rate limiting
    if (i < batches.length - 1) {
      console.log(`\n⏸️  Pausing 5 seconds before next batch...`)
      await delay(5000)
    }
  }

  // Final summary
  console.log(`\n${'='.repeat(80)}`)
  console.log('MIGRATION COMPLETE')
  console.log('='.repeat(80))
  console.log(`Total processed: ${progress.successCount + progress.failureCount + progress.skippedCount}`)
  console.log(`✅ Successful: ${progress.successCount}`)
  console.log(`❌ Failed: ${progress.failureCount}`)
  console.log(`⏭️  Skipped: ${progress.skippedCount}`)
  console.log(`Start time: ${progress.startTime}`)
  console.log(`End time: ${new Date().toISOString()}`)

  if (!dryRun && progress.failureCount === 0) {
    console.log(`\n🎉 All users migrated successfully!`)
    console.log(`You can now delete the progress file: ${PROGRESS_FILE}`)
  } else if (progress.failureCount > 0) {
    console.log(`\n⚠️  Some migrations failed. Review the output above.`)
    console.log(`Progress saved to: ${PROGRESS_FILE}`)
    console.log(`You can resume with: --resume`)
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const testUserIndex = args.indexOf('--test-user')
  const batchSizeIndex = args.indexOf('--batch-size')
  const resume = args.includes('--resume')

  const batchSize = batchSizeIndex !== -1 && args[batchSizeIndex + 1]
    ? parseInt(args[batchSizeIndex + 1], 10)
    : BATCH_SIZE

  if (testUserIndex !== -1 && args[testUserIndex + 1]) {
    // Single user test mode uses the original simple logic
    const username = args[testUserIndex + 1]
    console.log('Single user test - using simple migration script instead')
    console.log('Run: tsx scripts/takeout/migrate-to-team.ts --test-user ' + username)
    process.exit(0)
  } else {
    await migrateAll(dryRun, batchSize, resume)
  }
}

main().catch(console.error)
