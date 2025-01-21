import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import {
  DEFAULT_ROLE_ID,
  getDiscordClient,
  TAKEOUT_GROUP_ID,
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

  const { subscription, hasDiscordPrivateChannels, discordSeats } =
    await ensureSubscription(supabase, subscriptionId)

  const discordInvites = await supabaseAdmin
    .from('discord_invites')
    .select('*')
    .eq('subscription_id', subscription.data.id)

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
    (subscription.data.metadata as Record<string, any>)?.discord_channel || null
  if (hasDiscordPrivateChannels && !discordChannelId) {
    let channelName = subscription.data.id
    try {
      const githubData = await fetch('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${userPrivate.data.github_token}`,
        },
      }).then((res) => res.json())
      channelName = githubData.data.login
    } catch (error) {}

    const discordChannel = await discordClient.api.guilds.createChannel(
      TAMAGUI_DISCORD_GUILD_ID,
      {
        name: channelName,
        parent_id: TAKEOUT_GROUP_ID,
        permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
        topic: `Sub Created at ${subscription.data.created} - ID: ${subscription.data.id}`,
      }
    )

    await discordClient.api.channels.createMessage(discordChannel.id, {
      content: `Hello and welcome to your private Takeout channel! The creators of Takeout are here as well, so feel free to ask any questions and give us feedback as you go.`,
    })

    discordChannelId = discordChannel.id

    await supabaseAdmin
      .from('subscriptions')
      .update({ metadata: { discord_channel: discordChannel.id } })
      .eq('id', subscription.data.id)
  }

  if (req.method === 'DELETE') {
    if (discordChannelId) {
      await discordClient.api.channels.edit(discordChannelId, {
        permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
      })
    }
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
      .eq('subscription_id', subscription.data.id)
    return Response.json({ message: 'discord invites reset' })
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

    if (discordChannelId) {
      const channel = await discordClient.api.channels.get(discordChannelId)

      await discordClient.api.channels.edit(discordChannelId, {
        permission_overwrites: [
          ...(channel as any).permission_overwrites, // other permissions
          { id: userDiscordId, type: 1, allow: roleBitField },
        ],
      })
    }

    await supabaseAdmin.from('discord_invites').insert({
      discord_user_id: userDiscordId,
      subscription_id: subscription.data.id,
    })

    await discordClient.api.guilds.addRoleToMember(
      TAMAGUI_DISCORD_GUILD_ID,
      userDiscordId,
      TAKEOUT_ROLE_ID
    )
  }

  return Response.json({ message: `Done!` })
})
