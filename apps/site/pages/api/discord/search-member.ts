import { TAMAGUI_DISCORD_GUILD_ID, discordClient } from '@lib/discord'
import { Database } from '@lib/supabase-types'
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createPagesServerClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    res.status(401).json({
      error: 'you are not authenticated',
    })
  }

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
