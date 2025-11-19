import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import {
  DEFAULT_ROLE_ID,
  getDiscordClient,
  TAKEOUT_ROLE_ID,
  TAMAGUI_DISCORD_GUILD_ID,
} from '~/features/discord/helpers'
import {
  getActiveSubscriptions,
  getAllActiveSubscriptions,
} from '~/features/user/helpers'
import { ProductName } from '~/shared/types/subscription'

const roleBitField = '1024' // VIEW_CHANNEL

// Add new constant for support category
const SUPPORT_GROUP_ID = '1234567890' // FIXME

export type DiscordChannelStatus = {
  discordSeats: number
  currentlyOccupiedSeats: number
}

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
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

  const subscription = await getActiveSubscriptions(user.id, subscriptionId)

  if (!subscription) {
    return Response.json({ message: 'No subscription found' }, { status: 400 })
  }

  // Get ALL user subscriptions to calculate total support seats
  const allUserSubscriptions = await getAllActiveSubscriptions(user.id)

  if (!allUserSubscriptions || allUserSubscriptions.length === 0) {
    return Response.json({ message: 'No subscriptions found' }, { status: 400 })
  }

  // Filter for support-related subscriptions (Chat and/or Support tiers)
  const supportSubscriptions = allUserSubscriptions.filter((sub) =>
    sub.subscription_items?.some(
      (item) =>
        item.price?.product?.name === ProductName.TamaguiSupport ||
        item.price?.product?.name === ProductName.TamaguiChat
    )
  )

  if (!supportSubscriptions.length) {
    return Response.json(
      { message: 'No support or chat subscription found' },
      { status: 400 }
    )
  }

  // Calculate total Discord seats from ALL support subscriptions
  let calculatedDiscordSeats = 0
  let supportTier = 0
  let hasChat = false

  supportSubscriptions.forEach((supportSub) => {
    const supportItems = supportSub.subscription_items?.filter(
      (item) =>
        item.price?.product?.name === ProductName.TamaguiSupport ||
        item.price?.product?.name === ProductName.TamaguiChat
    )

    if (supportItems?.length) {
      // Check for chat support (base 2 invites)
      const chatItem = supportItems.find(
        (item) => item.price?.product?.name === ProductName.TamaguiChat
      )
      if (chatItem) {
        hasChat = true
        calculatedDiscordSeats += 2 // Chat Support gives 2 invites
      }

      // Check for support tiers (4 additional invites per tier)
      const tierItem = supportItems.find(
        (item) => item.price?.product?.name === ProductName.TamaguiSupport
      )
      if (tierItem) {
        // Use subscription's quantity field to determine tier level
        const tier = supportSub.quantity ?? 0
        supportTier = Math.max(supportTier, tier)
        calculatedDiscordSeats += tier * 4
      }
    }
  })

  // If no valid support found, return error
  if (!hasChat && supportTier === 0) {
    return Response.json(
      {
        message: 'No valid chat support or support tier subscription found',
      },
      { status: 400 }
    )
  }

  // Use calculated seats from all subscriptions
  let discordSeats = calculatedDiscordSeats

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

  let userName = user.email?.split('@')[0]

  if (!userName) {
    return Response.json({ message: 'No user name found' }, { status: 400 })
  }

  // if userName contains invalid characters (such as ., -, _) replace them with _
  userName = userName.replace(/[.-_]/g, '_')

  if (!discordChannelId) {
    // Create private channel for Support tier user
    let channelSuffix = ''
    if (hasChat && supportTier > 0) {
      channelSuffix = `chat-tier-${supportTier}`
    } else if (hasChat) {
      channelSuffix = 'chat'
    } else if (supportTier > 0) {
      channelSuffix = `tier-${supportTier}`
    }

    let channelName = `${userName}-${channelSuffix}`

    // Create a new category for support channels if it doesn't exist
    let supportCategory
    try {
      supportCategory = await discordClient.api.guilds.createChannel(
        TAMAGUI_DISCORD_GUILD_ID,
        {
          name: 'TAKEOUT-SUPPORT',
          type: 4, // 4 is category type
          permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
        }
      )
    } catch (error) {
      // If category already exists, use the existing one
      supportCategory = { id: SUPPORT_GROUP_ID }
    }

    // Create topic with subscription details
    let topicParts: string[] = []
    if (hasChat) topicParts.push('Chat Support')
    if (supportTier > 0) topicParts.push(`Support Tier ${supportTier}`)
    const topic = `${topicParts.join(' + ')} - Created at ${subscription.created} - ID: ${subscription.id}`

    const discordChannel = await discordClient.api.guilds.createChannel(
      TAMAGUI_DISCORD_GUILD_ID,
      {
        name: channelName,
        parent_id: supportCategory.id,
        permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
        topic: topic,
      }
    )

    // Create welcome message based on subscription type
    await discordClient.api.channels.createMessage(discordChannel.id, {
      content: `Welcome to your private support channel! The Tamagui team is here to help with any questions or issues you have.`,
    })

    discordChannelId = discordChannel.id

    await supabaseAdmin
      .from('subscriptions')
      .update({ metadata: { discord_channel: discordChannel.id } })
      .eq('id', subscription.id)
  }

  if (req.method === 'DELETE') {
    if (discordChannelId) {
      await discordClient.api.channels.delete(discordChannelId)
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
      .eq('subscription_id', subscription.id)

    // Clear the discord_channel metadata since we deleted the channel
    await supabaseAdmin
      .from('subscriptions')
      .update({ metadata: {} })
      .eq('id', subscription.id)

    return Response.json({ message: 'discord access reset' })
  }

  const userDiscordId = body.discord_id
  if (!userDiscordId) {
    throw Response.json(
      { message: 'no discord_id is provided' },
      {
        status: 401,
      }
    )
  }

  if (req.method === 'POST') {
    if (currentlyOccupiedSeats >= discordSeats) {
      throw Response.json(
        {
          message: `you've maxed out the members of your channel ${currentlyOccupiedSeats}/${discordSeats}`,
        },
        {
          status: 401,
        }
      )
    }

    // Check if user is already added to this subscription
    const existingInvite = discordInvites.data.find(
      (invite) => invite.discord_user_id === userDiscordId
    )

    if (existingInvite) {
      return Response.json(
        { message: 'User is already added to this support channel!' },
        { status: 400 }
      )
    }

    if (discordChannelId) {
      const channel = await discordClient.api.channels.get(discordChannelId)

      await discordClient.api.channels.edit(discordChannelId, {
        permission_overwrites: [
          ...(channel as any).permission_overwrites,
          { id: userDiscordId, type: 1, allow: roleBitField },
        ],
      })
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

    return Response.json({ message: 'Added to your private support channel!' })
  }

  return Response.json({ message: 'Done!' })
})
