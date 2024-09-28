import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getDiscordClient, TAMAGUI_DISCORD_GUILD_ID } from '~/features/discord/helpers'

export default apiRoute(async (req) => {
  await ensureAuth({ req })

  const url = new URL(req.url)
  const query = url.searchParams.get('query')

  if (typeof query !== 'string') {
    return Response.json({ error: 'bad query provided' }, { status: 400 })
  }

  const discordClient = await getDiscordClient()
  const results = await discordClient.api.guilds.searchForMembers(
    TAMAGUI_DISCORD_GUILD_ID,
    {
      query: query,
      limit: 5,
    }
  )

  return Response.json(results)
})
