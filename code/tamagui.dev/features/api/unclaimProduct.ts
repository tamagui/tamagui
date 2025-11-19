import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { supabaseAdmin } from '../auth/supabaseAdmin'
import { removeUserFromTeam } from '../github/helpers'
import {
  getDiscordClient,
  TAKEOUT_ROLE_ID,
  TAMAGUI_DISCORD_GUILD_ID,
} from '../discord/helpers'
import type { Database, Json } from '../supabase/types'

/**
 * removes access to previously claimed access
 */
export async function unclaimSubscription(subscription: Stripe.Subscription) {
  // if (typeof data !== 'object' || !data || Array.isArray(data)) {
  //   throw new Error('bad `data` on claim row')
  // }
  const claimRes = await supabaseAdmin
    .from('claims')
    .select('*')
    .eq('subscription_id', subscription.id)
  if (claimRes.error) throw claimRes.error
  const subscriptionRes = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('id', subscription.id)
    .single()
  if (subscriptionRes.error) throw subscriptionRes.error

  const userId = subscriptionRes.data?.user_id
  const userRes = await supabaseAdmin.auth.admin.getUserById(userId)
  if (userRes.error) throw userRes.error

  const { user } = userRes.data

  // Remove Discord access if user has Discord invites for this subscription
  await unclaimDiscordAccess(subscription.id)

  for (const claim of claimRes.data) {
    const claimData = claim.data
    if (typeof claimData !== 'object' || !claimData || Array.isArray(claimData)) {
      throw new Error('bad `data` on claim row')
    }

    await unclaimRepoAccess({ data: claimData, claim, user })

    await supabaseAdmin
      .from('claims')
      .update({
        unclaimed_at: new Date().toISOString(),
      })
      .eq('id', claim.id)
  }
}

type UnclaimFunction = (args: {
  data: {
    [key: string]: Json | undefined
  }
  user: User
  claim: Database['public']['Tables']['claims']['Row']
}) => Promise<void>

const unclaimRepoAccess: UnclaimFunction = async ({ data, user }) => {
  const githubId = (data.user_github as any)?.id as number | string | undefined
  if (!githubId) {
    throw new Error(`user_github.id is not set on product metadata or is not correct`)
  }
  const githubUser = await fetch(`https://api.github.com/user/${githubId}`).then((res) =>
    res.json()
  )

  // Check for team_slug first (new claims), fall back to default 'early-access' for old claims
  const teamSlug = data.team_slug
  if (typeof teamSlug !== 'string') {
    // For old claims without team_slug, use the 'early-access' team
    console.warn(
      `Claim missing team_slug, using default 'early-access' team for ${githubUser.login}`
    )
    await removeUserFromTeam('early-access', githubUser.login)
    return
  }

  console.info(`Unclaiming team access for ${githubUser.login} from team ${teamSlug}`)
  await removeUserFromTeam(teamSlug, githubUser.login)
}

async function unclaimDiscordAccess(subscriptionId: string) {
  try {
    // Get Discord invites for this subscription
    const { data: discordInvites, error: invitesError } = await supabaseAdmin
      .from('discord_invites')
      .select('discord_user_id')
      .eq('subscription_id', subscriptionId)

    if (invitesError) {
      console.error('Error fetching discord_invites:', invitesError)
      return
    }

    if (!discordInvites || discordInvites.length === 0) {
      console.info(`No Discord invites found for subscription ${subscriptionId}`)
      return
    }

    // Get Discord client
    const discordClient = await getDiscordClient()

    // Remove role from all Discord users for this subscription
    console.info(
      `Removing Discord Takeout role from ${discordInvites.length} users for subscription ${subscriptionId}`
    )

    await Promise.allSettled(
      discordInvites.map((inv) =>
        discordClient.api.guilds
          .removeRoleFromMember(
            TAMAGUI_DISCORD_GUILD_ID,
            inv.discord_user_id,
            TAKEOUT_ROLE_ID
          )
          .catch((error) => {
            console.error(
              `Failed to remove Discord role from user ${inv.discord_user_id}:`,
              error.message
            )
          })
      )
    )

    // Delete discord_invites records
    const { error: deleteError } = await supabaseAdmin
      .from('discord_invites')
      .delete()
      .eq('subscription_id', subscriptionId)

    if (deleteError) {
      console.error('Error deleting discord_invites:', deleteError)
    } else {
      console.info(`Deleted discord_invites for subscription ${subscriptionId}`)
    }
  } catch (error) {
    console.error('Error in unclaimDiscordAccess:', error)
    // Don't throw - we still want GitHub access removal to succeed
  }
}
