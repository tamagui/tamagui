import { apiRoute } from '@lib/apiRoute'
import { checkSponsorAccess } from '@lib/getSponsorData'
import { protectApiRoute } from '@lib/protectApiRoute'
import type { ThemeRow } from '@tamagui/studio/src/store/tb-store'

import { setupCors } from '../../../lib/cors'

export type StoreData = Array<{
  themes: Record<string, ThemeRow>
}>
export default apiRoute(async (req, res) => {
  const { supabase, user } = await protectApiRoute({ req, res })
  const { teamId } = await checkSponsorAccess({
    req,
    res,
    supabase,
    throwIfNoAccess: true,
  })

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
  for (const { themes } of body) {
    if (!themes) {
      continue
    }
    await supabase.from('studio_themes').insert(
      Object.entries(themes).map(([idStr, theme]) => ({
        id: Number(idStr),
        data: theme,
        user_id: user.id,
        team_id: teamId,
      }))
    )
  }
  console.log('store state: ', JSON.stringify(body, null, 2))
  res.json({ message: 'successfully saved' })
})
