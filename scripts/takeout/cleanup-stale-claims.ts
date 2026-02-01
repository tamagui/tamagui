#!/usr/bin/env tsx

/**
 * Clean up stale claims based on the analysis file
 *
 * Usage:
 *   tsx scripts/takeout/cleanup-stale-claims.ts <analysis-file> [--dry-run]
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const analysisFile = args.find((arg) => !arg.startsWith('--'))

  if (!analysisFile) {
    console.error(
      'Usage: tsx cleanup-stale-claims.ts <stale-claims-file.json> [--dry-run]'
    )
    process.exit(1)
  }

  console.log('\n' + '='.repeat(80))
  console.log(`CLEANUP STALE CLAIMS${dryRun ? ' (DRY RUN)' : ''}`)
  console.log('='.repeat(80) + '\n')

  // Read the stale claims file
  console.log(`📖 Reading analysis file: ${analysisFile}`)
  const fileContent = JSON.parse(readFileSync(analysisFile, 'utf-8'))
  const staleClaims = fileContent.claims

  console.log(`   Found ${staleClaims.length} stale claims to clean up`)
  console.log(`   Generated at: ${fileContent.generated_at}`)

  if (staleClaims.length === 0) {
    console.log('\n✅ No stale claims to clean up!')
    return
  }

  // Extract claim IDs
  const claimIds = staleClaims.map((c: any) => c.id)

  console.log(`\n⚠️  WARNING: This will mark ${claimIds.length} claims as unclaimed`)
  console.log('   (Setting unclaimed_at to current timestamp)')

  if (!dryRun) {
    console.log('\n⏸️  Starting in 3 seconds... (Ctrl+C to cancel)')
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }

  console.log('\n' + '='.repeat(80))
  console.log('PROCESSING')
  console.log('='.repeat(80) + '\n')

  if (dryRun) {
    console.log(`[DRY RUN] Would update ${claimIds.length} claims`)
    console.log(`   Sample claim IDs: ${claimIds.slice(0, 5).join(', ')}...`)
    console.log('\n💡 Run without --dry-run to perform the actual cleanup')
    return
  }

  // Batch update claims
  const batchSize = 100
  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < claimIds.length; i += batchSize) {
    const batch = claimIds.slice(i, i + batchSize)

    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(claimIds.length / batchSize)} (${batch.length} claims)...`
    )

    try {
      const { error } = await supabase
        .from('claims')
        .update({ unclaimed_at: new Date().toISOString() })
        .in('id', batch)

      if (error) {
        console.error(`   ❌ Batch failed:`, error)
        failureCount += batch.length
      } else {
        console.log(`   ✅ Updated ${batch.length} claims`)
        successCount += batch.length
      }
    } catch (error) {
      console.error(`   ❌ Batch error:`, error)
      failureCount += batch.length
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Successfully updated: ${successCount}`)
  console.log(`❌ Failed: ${failureCount}`)
  console.log(`📊 Total processed: ${successCount + failureCount}`)

  if (failureCount === 0) {
    console.log('\n🎉 All stale claims cleaned up successfully!')
  } else {
    console.log('\n⚠️  Some claims failed to update. Check the errors above.')
  }
}

main().catch(console.error)
