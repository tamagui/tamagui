import {
  DEFAULT_ROLE_ID,
  TAKEOUT_GROUP_ID,
  TAMAGUI_DISCORD_GUILD_ID,
  discordClient,
} from '@lib/discord'
import { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const roleBitField = '1024' // VIEW_CHANNEL

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    res.status(401).json({
      error: 'you are not authenticated',
    })
  }

  const subscriptionId = req[req.method === 'GET' ? 'query' : 'body'].subscription_id
  const subscription = await supabase
    .from('subscriptions')
    .select(
      'id, metadata, created, subscription_items(id, prices(id, description, products(id, name, metadata)))'
    )
    .eq('id', subscriptionId)
    .single()

  if (subscription.error) {
    return res.status(404).json({
      message: 'no subscription with the provided id found that belongs to your user.',
    })
  }

  const starterSubItem = getArray(subscription.data.subscription_items).find(
    (item) =>
      (getSingle(getSingle(item?.prices)?.products)?.metadata as Record<string, any>)
        ?.slug === 'universal-starter'
  )
  if (!starterSubItem) {
    return res.status(401).json({
      message: 'the provided subscription does not include the takeout starter',
    })
  }

  const discordInvites = await supabaseAdmin
    .from('discord_invites')
    .select('*')
    .eq('subscription_id', subscription.data.id)
  if (discordInvites.error) {
    throw discordInvites.error
  }

  const pricingDescription = getSingle(starterSubItem.prices)?.description?.toLowerCase()
  const current = discordInvites.data.length
  let max = 1
  if (pricingDescription?.includes('personal')) {
    max = 1
  }

  const minMaxMatch = Number(
    pricingDescription?.match(/team \([0-9]+-([0-9]+) seats\)/)?.[1]
  )
  if (minMaxMatch && !isNaN(minMaxMatch)) {
    max = minMaxMatch
  }

  const minOnlyMatch = Number(pricingDescription?.match(/team \(\+([0-9]+) seats\)/)?.[1])
  if (minOnlyMatch && !isNaN(minOnlyMatch)) {
    max = 10
  }

  if (req.method === 'GET') {
    return res.json({
      current,
      max,
    })
  }

  let discordChannelId = (subscription.data.metadata as Record<string, any>)
    ?.discord_channel
  if (!discordChannelId) {
    const discordChannel = await discordClient.api.guilds.createChannel(
      TAMAGUI_DISCORD_GUILD_ID,
      {
        name: subscription.data.id,
        parent_id: TAKEOUT_GROUP_ID,
        permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
        topic: `Sub Created at ${subscription.data.created} - ID: ${subscription.data.id}`,
      }
    )

    discordChannelId = discordChannel.id

    await supabaseAdmin
      .from('subscriptions')
      .update({ metadata: { discord_channel: discordChannel.id } })
      .eq('id', subscription.data.id)
  }

  if (req.method === 'DELETE') {
    await discordClient.api.channels.edit(discordChannelId, {
      permission_overwrites: [{ id: DEFAULT_ROLE_ID, type: 0, deny: roleBitField }],
    })
    await supabaseAdmin
      .from('discord_invites')
      .delete()
      .eq('subscription_id', subscription.data.id)
    return res.json({ message: 'discord invites reset' })
  }

  if (req.method === 'POST') {
    if (current >= max) {
      return res.status(401).json({
        message: `you've maxed out the members of your channel ${current}/${max}`,
      })
    }

    const userDiscordId = req.body.discord_id
    if (!userDiscordId) {
      return res.status(401).json({ message: 'no discord_id is provided' })
    }
    const channel = await discordClient.api.channels.get(discordChannelId)

    await discordClient.api.channels.edit(discordChannelId, {
      permission_overwrites: [
        ...(channel as any).permission_overwrites, // other permissions
        { id: userDiscordId, type: 1, allow: roleBitField },
      ],
    })
    await supabaseAdmin.from('discord_invites').insert({
      discord_channel_id: discordChannelId,
      discord_user_id: userDiscordId,
      subscription_id: subscription.data.id,
    })
  }
  res.json({ message: `successfully added to takeout -> #${subscription.data.id}` })
}

export default handler
