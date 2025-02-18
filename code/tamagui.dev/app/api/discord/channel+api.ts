import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import {
  DEFAULT_ROLE_ID,
  getDiscordClient,
  TAKEOUT_ROLE_ID,
  TAMAGUI_DISCORD_GUILD_ID,
  TAKEOUT_GENERAL_CHANNEL,
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
    // Pro users get access to the general channel
    const channels = await discordClient.api.guilds.getChannels(TAMAGUI_DISCORD_GUILD_ID)
    const generalChannel = channels.find((c: any) => c.name === TAKEOUT_GENERAL_CHANNEL)

    if (generalChannel) {
      discordChannelId = generalChannel.id
      await supabaseAdmin
        .from('subscriptions')
        .update({ metadata: { discord_channel: generalChannel.id } })
        .eq('id', subscription.data.id)
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
      .eq('subscription_id', subscription.data.id)
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
      subscription_id: subscription.data.id,
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
