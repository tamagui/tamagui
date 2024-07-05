import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

const handler = apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })
  const { teamId } = await ensureAccess({
    req,
    supabase,
    checkForStudioAccess: true,
  })

  if (!teamId) {
    throw new Error(`No teamId found`)
  }
  console.info(`Studio load ${teamId}`)

  const results = await supabase
    .from('studio_themes')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)

  if (results.error) {
    throw results.error
  }

  console.info(`Loaded ${results.data.length} results for team ${teamId} user ${user.id}`)

  const response = {
    themeSuites: {},
  }

  for (const item of results.data) {
    if (!item.theme_id) {
      console.error('no theme id! ' + item.id)
      continue
    }
    response.themeSuites[item.theme_id] = item.data
  }

  console.info(`Sending themeSuites for ids: ${results.data.map((x) => x.id).join(', ')}`)

  return Response.json(response)
})

export default handler
