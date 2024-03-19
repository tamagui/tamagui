import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'

export type StoreData = { themeSuites: Record<string, any> }

export default apiRoute(async (req, res) => {
  const { supabase, user } = await protectApiRoute({ req, res })
  const { teamId } = await authorizeUserAccess(
    {
      req,
      res,
      supabase,
    },
    { checkForStudioAccess: true }
  )

  let body: StoreData
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    res.status(400).json({
      message: 'an error occurred',
    })
    return
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

  res.json({ message: 'successfully saved' })
})
