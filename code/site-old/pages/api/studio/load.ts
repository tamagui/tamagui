import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'

const handler = apiRoute(async (req, res) => {
  const { supabase, user } = await protectApiRoute({ req, res })
  const { teamId } = await authorizeUserAccess(
    {
      req,
      res,
      supabase,
    },
    {
      checkForStudioAccess: true,
    }
  )

  const results = await supabase
    .from('studio_themes')
    .select('*')
    .eq('team_id', teamId)
    .eq('user_id', user.id)

  if (results.error) {
    res.status(400).json({
      message: 'an error occurred.',
    })
    return
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

  res.json(response)
})

export default handler
