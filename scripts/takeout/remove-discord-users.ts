#!/usr/bin/env tsx

/**
 * Remove Discord users from Takeout role based on analysis file
 *
 * Usage:
 *   tsx scripts/takeout/remove-discord-users.ts <users-to-remove-file.json> [--dry-run]
 */

import { Client, GatewayIntentBits } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'
import { readFileSync } from 'fs'

const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

// Discord IDs from features/discord/helpers.ts
const TAKEOUT_ROLE_ID = '1131082605052301403'
const TAMAGUI_DISCORD_GUILD_ID = '909986013848412191'
const DELAY_MS = 1000 // Rate limiting - 1 second between removals

if (!DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN environment variable')
  process.exit(1)
}

async function getDiscordClient() {
  const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN)

  const gateway = new WebSocketManager({
    token: DISCORD_BOT_TOKEN,
    intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
    rest,
  })

  const discordClient = new Client({ rest, gateway })
  return discordClient
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

async function removeRoleFromUser(
  discordClient: Client,
  userId: string,
  username: string,
  dryRun: boolean
): Promise<boolean> {
  if (dryRun) {
    console.log(`   [DRY RUN] Would remove role from ${username}`)
    return true
  }

  try {
    await discordClient.api.guilds.removeRoleFromMember(
      TAMAGUI_DISCORD_GUILD_ID,
      userId,
      TAKEOUT_ROLE_ID
    )
    console.log(`   ✅ Removed role from ${username}`)
    return true
  } catch (error: any) {
    console.error(`   ❌ Failed to remove role from ${username}:`, error.message)
    return false
  }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const usersFile = args.find((arg) => !arg.startsWith('--'))

  if (!usersFile) {
    console.error(
      'Usage: tsx remove-discord-users.ts <users-to-remove-file.json> [--dry-run]'
    )
    process.exit(1)
  }

  console.log('\n' + '='.repeat(80))
  console.log(`REMOVE DISCORD USERS${dryRun ? ' (DRY RUN)' : ''}`)
  console.log('='.repeat(80) + '\n')

  // Read the users file
  console.log(`📖 Reading file: ${usersFile}`)
  const fileContent = JSON.parse(readFileSync(usersFile, 'utf-8'))
  const usersToRemove = fileContent.users

  console.log(`   Found ${usersToRemove.length} users to remove`)
  console.log(`   Generated at: ${fileContent.generated_at}`)

  if (usersToRemove.length === 0) {
    console.log('\n✅ No users to remove!')
    return
  }

  console.log(
    `\n⚠️  WARNING: This will remove the Takeout role from ${usersToRemove.length} Discord users`
  )

  if (!dryRun) {
    console.log('\n⏸️  Starting in 3 seconds... (Ctrl+C to cancel)')
    await delay(3000)
  }

  console.log('\n' + '='.repeat(80))
  console.log('PROCESSING')
  console.log('='.repeat(80) + '\n')

  const discordClient = await getDiscordClient()

  let successCount = 0
  let failureCount = 0

  for (let i = 0; i < usersToRemove.length; i++) {
    const user = usersToRemove[i]
    console.log(
      `[${i + 1}/${usersToRemove.length}] ${user.username} (${user.global_name || 'no global name'})`
    )
    console.log(`   Discord ID: ${user.discord_id}`)
    console.log(
      `   Inactive subs: ${user.inactive_subscription_ids?.join(', ') || 'none'}`
    )

    const success = await removeRoleFromUser(
      discordClient,
      user.discord_id,
      user.username,
      dryRun
    )

    if (success) {
      successCount++
    } else {
      failureCount++
    }

    // Rate limiting
    if (i < usersToRemove.length - 1) {
      await delay(DELAY_MS)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Successfully removed: ${successCount}`)
  console.log(`❌ Failed: ${failureCount}`)
  console.log(`📊 Total processed: ${successCount + failureCount}`)

  if (dryRun) {
    console.log('\n💡 Run without --dry-run to actually remove users')
  } else if (failureCount === 0) {
    console.log('\n🎉 All users removed successfully!')
  } else {
    console.log('\n⚠️  Some removals failed. Check the errors above.')
  }
}

main().catch(console.error)
