import { apiRoute } from '@lib/apiRoute'
import { setupCors } from '@lib/cors'
import { checkSponsorAccess } from '@lib/getSponsorData'
import { protectApiRoute } from '@lib/protectApiRoute'
import * as apis from '@tamagui/studio/api'

export default apiRoute(async (req, res) => {
  setupCors(req, res)
  const { supabase } = await protectApiRoute({ req, res })
  const { hasStudioAccess } = await checkSponsorAccess({
    req,
    res,
    supabase,
  })
  if (!hasStudioAccess) {
    res.status(403).json({
      message: "You don't have access to this part of the studio.",
    })
  }

  const procedureName = req.query.procedure

  if (req.method === 'POST') {
    if (typeof procedureName !== 'string') {
      res
        .status(400)
        .json({ error: '`procedure` query param is not provided / incorrect.' })
      return
    }

    try {
      res.json(await apis[procedureName](JSON.parse(req.body)))
      return
    } catch (error) {
      console.log(error)
      res.status(400).json({ error: 'an unknown error occurred' })
      return
    }
  }

  res.status(405).json({})
})
