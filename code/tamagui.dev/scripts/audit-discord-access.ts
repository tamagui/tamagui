/**
 * Audit Discord Access
 *
 * Checks all discord_invites records against subscription status and removes
 * Discord roles for users whose subscriptions are no longer active.
 *
 * Usage:
 *   npx tsx scripts/audit-discord-access.ts           # dry run
 *   npx tsx scripts/audit-discord-access.ts --fix     # remove stale roles
 */

import * as dotenv from 'dotenv'
dotenv.config()

import { createClient } from '@supabase/supabase-js'
import { REST } from '@discordjs/rest'
import { API } from '@discordjs/core'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN!

const TAKEOUT_ROLE_ID = '1131082605052301403'
const TAMAGUI_DISCORD_GUILD_ID = '909986013848412191'

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const shouldFix = process.argv.includes('--fix')

if (shouldFix && !DISCORD_BOT_TOKEN) {
  console.error('Missing DISCORD_BOT_TOKEN (required for --fix)')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

interface InviteWithSubscription {
  id: number
  discord_user_id: string
  subscription_id: string
  subscription_status: string | null
  user_email: string | null
}

async function getDiscordInvitesWithStatus(): Promise<InviteWithSubscription[]> {
  // get all discord_invites
  const { data: invites, error: invitesError } = await supabase
    .from('discord_invites')
    .select('id, discord_user_id, subscription_id')

  if (invitesError) {
    throw new Error(`Failed to get discord_invites: ${invitesError.message}`)
  }

  if (!invites || invites.length === 0) {
    return []
  }

  const results: InviteWithSubscription[] = []

  for (const invite of invites) {
    // check subscription status
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('status, user_id')
      .eq('id', invite.subscription_id)
      .maybeSingle()

    let email: string | null = null
    if (sub?.user_id) {
      const { data: userData } = await supabase.auth.admin.getUserById(sub.user_id)
      email = userData?.user?.email || null
    }

    results.push({
      id: invite.id,
      discord_user_id: invite.discord_user_id,
      subscription_id: invite.subscription_id,
      subscription_status: sub?.status || null,
      user_email: email,
    })
  }

  return results
}

async function main() {
  console.info('\n=== Discord Access Audit ===\n')
  console.info(`Mode: ${shouldFix ? 'FIX (will remove roles)' : 'DRY RUN (read only)'}\n`)

  console.info('Fetching discord invites with subscription status...')
  const invites = await getDiscordInvitesWithStatus()
  console.info(`Found ${invites.length} total discord invites\n`)

  const activeStatuses = ['active', 'trialing']

  const active: InviteWithSubscription[] = []
  const stale: InviteWithSubscription[] = []
  const orphaned: InviteWithSubscription[] = [] // subscription deleted entirely

  for (const invite of invites) {
    if (!invite.subscription_status) {
      orphaned.push(invite)
    } else if (activeStatuses.includes(invite.subscription_status)) {
      active.push(invite)
    } else {
      stale.push(invite)
    }
  }

  console.info('=== RESULTS ===\n')

  console.info(`Active subscriptions (${active.length}):`)
  for (const inv of active) {
    console.info(
      `   discord:${inv.discord_user_id} - ${inv.user_email || 'unknown'} (${inv.subscription_status})`
    )
  }

  console.info(`\nStale - subscription no longer active (${stale.length}):`)
  for (const inv of stale) {
    console.info(
      `   discord:${inv.discord_user_id} - ${inv.user_email || 'unknown'} (status: ${inv.subscription_status})`
    )
  }

  console.info(`\nOrphaned - subscription deleted (${orphaned.length}):`)
  for (const inv of orphaned) {
    console.info(`   discord:${inv.discord_user_id} - sub:${inv.subscription_id}`)
  }

  const toCleanup = [...stale, ...orphaned]

  if (shouldFix && toCleanup.length > 0) {
    console.info(`\n=== CLEANING UP ${toCleanup.length} INVITES ===\n`)

    const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN)
    const api = new API(rest)

    for (const inv of toCleanup) {
      console.info(`Removing role from discord:${inv.discord_user_id}...`)
      try {
        await api.guilds.removeRoleFromMember(
          TAMAGUI_DISCORD_GUILD_ID,
          inv.discord_user_id,
          TAKEOUT_ROLE_ID
        )
        console.info(`   Role removed`)
      } catch (error: any) {
        // 10007 = unknown member (left the server)
        if (error?.code === 10007) {
          console.info(`   User not in server (already left)`)
        } else {
          console.info(`   Failed to remove role: ${error?.message || error}`)
        }
      }

      // delete the invite record
      const { error: deleteError } = await supabase
        .from('discord_invites')
        .delete()
        .eq('id', inv.id)

      if (deleteError) {
        console.info(`   Failed to delete invite record: ${deleteError.message}`)
      } else {
        console.info(`   Invite record deleted`)
      }
    }
  } else if (toCleanup.length > 0) {
    console.info(
      `\nRun with --fix to clean up ${toCleanup.length} stale/orphaned invites`
    )
  }

  console.info('\n=== SUMMARY ===')
  console.info(`Total discord invites: ${invites.length}`)
  console.info(`  - Active: ${active.length}`)
  console.info(`  - Stale (non-active sub): ${stale.length}`)
  console.info(`  - Orphaned (no sub): ${orphaned.length}`)
}

main().catch((error) => {
  console.error('\nError:', error.message)
  process.exit(1)
})
