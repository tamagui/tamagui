#!/usr/bin/env tsx

/**
 * Check Discord role assignments vs active Stripe subscriptions
 *
 * Usage:
 *   tsx scripts/takeout/check-discord-sync.ts
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Client, GatewayIntentBits } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const DISCORD_BOT_TOKEN = process.env.DISCORD_BOT_TOKEN

// Discord IDs from features/discord/helpers.ts
const TAKEOUT_ROLE_ID = '1131082605052301403'
const TAMAGUI_DISCORD_GUILD_ID = '909986013848412191'

// Products that grant early-access
const EARLY_ACCESS_PRODUCT_IDS = [
  'prod_RlRd2DVrG0frHe', // Tamagui Pro
  'prod_NzLEazaqBgoKnC', // Takeout Stack
  'prod_Rxu0x7jR0nWJSv', // Tamagui Pro Team Seats
]

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !STRIPE_SECRET_KEY || !DISCORD_BOT_TOKEN) {
  console.error('Missing required environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2020-08-27',
})

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

async function getActiveStripeSubscriptions() {
  console.log('💳 Fetching active Stripe subscriptions...')

  const allSubscriptions: Stripe.Subscription[] = []
  let hasMore = true
  let startingAfter: string | undefined

  while (hasMore) {
    const params: Stripe.SubscriptionListParams = {
      status: 'active',
      limit: 100,
    }
    if (startingAfter) {
      params.starting_after = startingAfter
    }

    const subscriptions = await stripe.subscriptions.list(params)
    allSubscriptions.push(...subscriptions.data)

    hasMore = subscriptions.has_more
    if (hasMore && subscriptions.data.length > 0) {
      startingAfter = subscriptions.data[subscriptions.data.length - 1].id
    }
  }

  // Filter for early-access products
  const takeoutSubscriptions = allSubscriptions.filter(sub => {
    return sub.items.data.some(item => {
      const productId = typeof item.price.product === 'string' ? item.price.product : item.price.product.id
      return EARLY_ACCESS_PRODUCT_IDS.includes(productId)
    })
  })

  console.log(`   Found ${takeoutSubscriptions.length} active subscriptions`)
  return takeoutSubscriptions
}

async function getUsersWithTakeoutRole() {
  console.log('🎮 Fetching Discord users with Takeout role...')

  const discordClient = await getDiscordClient()

  try {
    // Get all members with the takeout role
    const members = await discordClient.api.guilds.getMembers(TAMAGUI_DISCORD_GUILD_ID, {
      limit: 1000,
    })

    const membersWithRole = members.filter(member =>
      member.roles.includes(TAKEOUT_ROLE_ID)
    )

    console.log(`   Found ${membersWithRole.length} Discord users with Takeout role`)

    return membersWithRole.map(m => ({
      id: m.user!.id,
      username: m.user!.username,
      globalName: m.user!.global_name,
    }))
  } catch (error) {
    console.error('Error fetching Discord members:', error)
    throw error
  }
}

async function getDiscordToSubscriptionMapping(discordUserIds: string[]) {
  console.log('📊 Mapping Discord users to subscriptions...')

  const { data, error } = await supabase
    .from('discord_invites')
    .select('discord_user_id, subscription_id')
    .in('discord_user_id', discordUserIds)

  if (error) {
    console.error('Error fetching discord_invites:', error)
    throw error
  }

  // Create map of discord_user_id -> subscription_ids[]
  const mapping = new Map<string, string[]>()
  data?.forEach(row => {
    if (row.discord_user_id) {
      const existing = mapping.get(row.discord_user_id) || []
      existing.push(row.subscription_id)
      mapping.set(row.discord_user_id, existing)
    }
  })

  console.log(`   Found ${mapping.size} Discord users with invite records`)
  return mapping
}

async function main() {
  console.log('\n' + '='.repeat(80))
  console.log('DISCORD SYNC CHECK')
  console.log('='.repeat(80) + '\n')

  // Fetch all data
  const [subscriptions, discordUsersWithRole] = await Promise.all([
    getActiveStripeSubscriptions(),
    getUsersWithTakeoutRole()
  ])

  // Get subscription mappings
  const discordToSubscriptions = await getDiscordToSubscriptionMapping(
    discordUsersWithRole.map(u => u.id)
  )

  // Create set of active subscription IDs
  const activeSubscriptionIds = new Set(subscriptions.map(s => s.id))

  console.log('\n' + '='.repeat(80))
  console.log('ANALYSIS')
  console.log('='.repeat(80))

  // Check which Discord users should have access
  const validDiscordUsers: typeof discordUsersWithRole = []
  const invalidDiscordUsers: (typeof discordUsersWithRole[0] & { subscriptionIds?: string[] })[] = []
  const discordUsersNoMapping: typeof discordUsersWithRole = []

  for (const discordUser of discordUsersWithRole) {
    const subscriptionIds = discordToSubscriptions.get(discordUser.id)

    if (!subscriptionIds || subscriptionIds.length === 0) {
      // Discord user not linked to any subscriptions
      discordUsersNoMapping.push(discordUser)
      continue
    }

    // Check if any of their subscriptions are still active
    const hasActiveSubscription = subscriptionIds.some(subId =>
      activeSubscriptionIds.has(subId)
    )

    if (hasActiveSubscription) {
      validDiscordUsers.push(discordUser)
    } else {
      invalidDiscordUsers.push({
        ...discordUser,
        subscriptionIds
      })
    }
  }

  console.log(`\n📊 Summary:`)
  console.log(`   Active Stripe subscriptions: ${subscriptions.length}`)
  console.log(`   Discord users with Takeout role: ${discordUsersWithRole.length}`)
  console.log(`\n✅ Valid (have active subscription): ${validDiscordUsers.length}`)
  console.log(`❌ Invalid (no active subscription): ${invalidDiscordUsers.length}`)
  console.log(`⚠️  No Supabase mapping: ${discordUsersNoMapping.length}`)

  if (invalidDiscordUsers.length > 0) {
    console.log(`\n⚠️  Users to remove (no active subscription):`)
    console.log('='.repeat(80))
    invalidDiscordUsers.forEach((user, i) => {
      console.log(`${i + 1}. ${user.username} (${user.globalName || 'no global name'})`)
      console.log(`   Discord ID: ${user.id}`)
      console.log(`   Inactive Subscription IDs: ${user.subscriptionIds?.join(', ')}`)
      console.log('')
    })
  }

  if (discordUsersNoMapping.length > 0) {
    console.log(`\n⚠️  Users without Supabase mapping (may be old/test accounts):`)
    console.log('='.repeat(80))
    discordUsersNoMapping.forEach((user, i) => {
      console.log(`${i + 1}. ${user.username} (${user.globalName || 'no global name'})`)
      console.log(`   Discord ID: ${user.id}`)
      console.log('')
    })
  }

  console.log('='.repeat(80))

  // Generate report files
  const { writeFileSync, mkdirSync } = await import('fs')
  const { join } = await import('path')

  const tempDir = join(process.cwd(), 'tmp')
  mkdirSync(tempDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')

  // Save invalid users list
  if (invalidDiscordUsers.length > 0) {
    const invalidUsersFile = join(tempDir, `discord-users-to-remove-${timestamp}.json`)
    writeFileSync(invalidUsersFile, JSON.stringify({
      generated_at: new Date().toISOString(),
      count: invalidDiscordUsers.length,
      users: invalidDiscordUsers.map(u => ({
        discord_id: u.id,
        username: u.username,
        global_name: u.globalName,
        inactive_subscription_ids: u.subscriptionIds,
      }))
    }, null, 2))

    console.log(`\n📄 Saved users to remove: ${invalidUsersFile}`)
  }

  console.log('\n✅ Analysis complete!')
}

main().catch(console.error)
