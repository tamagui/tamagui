import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'

export type StoreData = { themeSuites: Record<string, any> }

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })
  const { teamId } = await ensureAccess({
    req,
    supabase,
    checkForStudioAccess: true,
  })

  const body: StoreData = await readBodyJSON(req)

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
