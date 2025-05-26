import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import {
  getDiscordClient,
  TAKEOUT_GENERAL_CHANNEL,
  TAKEOUT_ROLE_ID,
  TAMAGUI_DISCORD_GUILD_ID,
} from '~/features/discord/helpers'
import { ensureSubscription } from '../../../helpers/ensureSubscription'

const roleBitField = '1024' // VIEW_CHANNEL

export type DiscordChannelStatus = {
  discordSeats: number
  currentlyOccupiedSeats: number
}

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const userPrivate = await supabaseAdmin
    .from('users_private')
    .select('github_token')
    .eq('id', user.id)
    .single()

  if (userPrivate.error) {
    return Response.json(
      {
        message: 'no github connection found for you account. login using github first',
      },
      {
        status: 401,
      }
    )
  }

  const url = new URL(req.url)
  const subscriptionId =
    req.method === 'GET' ? url.searchParams.get('subscription_id') : body.subscription_id

  const {
    subscription,
    hasDiscordPrivateChannels,
    discordSeats: initialDiscordSeats,
  } = await ensureSubscription(user.id, subscriptionId)

  if (!subscription) {
    return Response.json({ message: 'No subscription found' }, { status: 400 })
  }

  /**
   * Try to get team subscription to get the total_seats for Tamagui Pro Team Seats plan.
   * In such case, the user should have more Discord seats given by the team subscription.
   *
   * TODO: Ideally, each team seat user would have their own pool of Discord seats.
   * This would allow users to invite themselves to the Discord channel without
   * taking up additional seats that should belong to other users.
   *
   * However, in the current implementation, the `discord_invites` table only logs
   * the `subscription_id`, and since a team subscription is treated as a single entity,
   * we cannot track which user is occupying the seat.
   * So we have no choice but to share the whole pool of Discord seats across all team members.
   *
   * Another edge case we haven't handle here is if a user is a member of multiple teams,
   * or they are a member of a team and also have their own subscription.
   * Ideally, we should add up all the seats from all subscriptions and teams.
   * But given the limitations of the current implementation, we cannot do that
   * since Discord seats are not tracked per user.
   */
  let discordSeats = initialDiscordSeats

  const teamSubscription = await (async () => {
    // First, try to find the team subscription where the user is the owner.
    const ownedTeamSubscription = await supabaseAdmin
      .from('team_subscriptions')
      .select('*')
      .eq('owner_id', user.id)
      .single()
    if (!ownedTeamSubscription.error) return ownedTeamSubscription.data

    // If the user is not a owner of any team, check if they are a member of a team.
    const teamMember = await supabaseAdmin
      .from('team_members')
      .select('team_subscription_id')
      .eq('member_id', user.id)
      .single()
    if (teamMember.error) return null

    const teamMemberSubscription = await supabaseAdmin
      .from('team_subscriptions')
      .select('*')
      .eq('id', teamMember.data.team_subscription_id)
      .single()
    if (!teamMemberSubscription.error) return teamMemberSubscription.data
  })()
  // If the user is a member of a team, check if the team subscription has more seats.
  // If so, use that as the discordSeats.
  if (teamSubscription) {
    const teamDiscordSeats = teamSubscription.total_seats
    if (teamDiscordSeats > discordSeats) {
      // Add 1 to the team discord seats to account for the owner
      discordSeats = teamDiscordSeats + 1
    }
  }

  const discordInvites = await supabaseAdmin
    .from('discord_invites')
    .select('*')
    .eq('subscription_id', subscription.id)

  if (discordInvites.error) {
    throw discordInvites.error
  }

  const currentlyOccupiedSeats = discordInvites.data.length

  if (req.method === 'GET') {
    return Response.json({
      currentlyOccupiedSeats,
      discordSeats,
    } satisfies DiscordChannelStatus)
  }

  const discordClient = await getDiscordClient()

  let discordChannelId: string | null =
    (subscription.metadata as Record<string, any>)?.discord_channel || null

  if (hasDiscordPrivateChannels && !discordChannelId) {
    // Pro users get access to the general channel
    const channels = await discordClient.api.guilds.getChannels(TAMAGUI_DISCORD_GUILD_ID)
    const generalChannel = channels.find((c: any) => c.name === TAKEOUT_GENERAL_CHANNEL)

    if (generalChannel) {
      discordChannelId = generalChannel.id
      await supabaseAdmin
        .from('subscriptions')
        .update({ metadata: { discord_channel: generalChannel.id } })
        .eq('id', subscription.id)
    }
  }

  if (req.method === 'DELETE') {
    await Promise.allSettled(
      discordInvites.data.map((inv) =>
        discordClient.api.guilds.removeRoleFromMember(
          TAMAGUI_DISCORD_GUILD_ID,
          inv.discord_user_id,
          TAKEOUT_ROLE_ID
        )
      )
    )
    await supabaseAdmin
      .from('discord_invites')
      .delete()
      .eq('subscription_id', subscription.id)
    return Response.json({ message: 'discord access reset' })
  }

  const userDiscordId = body.discord_id
  if (!userDiscordId) {
    return Response.json(
      { message: 'no discord_id is provided' },
      {
        status: 401,
      }
    )
  }

  if (req.method === 'POST') {
    if (currentlyOccupiedSeats >= discordSeats) {
      return Response.json(
        {
          message: `you've maxed out the members of your channel ${currentlyOccupiedSeats}/${discordSeats}`,
        },
        {
          status: 401,
        }
      )
    }

    await supabaseAdmin.from('discord_invites').insert({
      discord_user_id: userDiscordId,
      subscription_id: subscription.id,
    })

    await discordClient.api.guilds.addRoleToMember(
      TAMAGUI_DISCORD_GUILD_ID,
      userDiscordId,
      TAKEOUT_ROLE_ID
    )

    return Response.json({ message: 'Added to the Takeout general channel!' })
  }

  return Response.json({ message: 'Done!' })
})
