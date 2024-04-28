import { apiRoute } from '~/features/api/apiRoute'
import { authorizeUserAccess } from '~/features/api/authorizeUserAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

export type StoreData = { themeSuites: Record<string, any> }

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })
  const { teamId } = await authorizeUserAccess(
    {
      req,
      supabase,
    },
    { checkForStudioAccess: true }
  )

  let body: StoreData
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    return Response.json(
      {
        message: 'an error occurred',
      },
      {
        status: 400,
      }
    )
  }

  await supabase
    .from('studio_themes')
    .delete()
    .eq('user_id', user.id)
    .eq('team_id', teamId)

  try {
    console.info(`Saving theme suite ids ${Object.keys(body.themeSuites).join(', ')}`)
  } catch {
    // ok
  }

  for (const themeId in body.themeSuites) {
    await supabase.from('studio_themes').insert({
      id: +`${Math.random()}`.replace('.', ''),
      theme_id: themeId,
      data: body.themeSuites[themeId],
      user_id: user.id,
      team_id: teamId,
    })
  }

  return Response.json({ message: 'successfully saved' })
})
