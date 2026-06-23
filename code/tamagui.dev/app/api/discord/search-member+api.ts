import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getDiscordClient, TAMAGUI_DISCORD_GUILD_ID } from '~/features/discord/helpers'

export default apiRoute(async (req) => {
  // gate guild-member enumeration behind Pro (this is part of the paid support/team flow)
  const { user } = await ensureAuth({ req })
  const { hasPro } = await ensureAccess({ user })
  if (!hasPro) {
    return Response.json({ error: 'Not authorized' }, { status: 403 })
  }

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
