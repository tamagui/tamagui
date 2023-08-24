import { TAMAGUI_DISCORD_GUILD_ID, discordClient } from '@lib/discord'
import { protectApiRoute } from '@lib/protectApiRoute'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  await protectApiRoute(req, res)

  const query = req.query.query

  if (typeof query !== 'string') {
    return res.status(400).json({ error: 'bad query provided' })
  }

  const results = await discordClient.api.guilds.searchForMembers(
    TAMAGUI_DISCORD_GUILD_ID,
    {
      query: query,
      limit: 5,
    }
  )

  res.json(results)
}

export default handler
