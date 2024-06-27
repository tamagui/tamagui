import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'

let apis
export default apiRoute(async (req, res) => {
  try {
    apis = await require('@tamagui/studio/api')
  } catch (error) {
    console.error('repo is not unlocked. returning.', error)
    res.status(500).json({})
    return
  }

  const { supabase } = await protectApiRoute({ req, res })

  await authorizeUserAccess(
    {
      req,
      res,
      supabase,
    },
    {
      checkForStudioAccess: true,
    }
  )

  const procedureName = req.query.procedure

  if (req.method === 'POST') {
    if (typeof procedureName !== 'string') {
      res
        .status(400)
        .json({ error: '`procedure` query param is not provided / incorrect.' })
      return
    }

    if (!(procedureName in apis)) {
      res.status(400).json({ error: `No procedure found: ${procedureName}` })
      return
    }

    try {
      res.json(await apis[procedureName](JSON.parse(req.body)))
      return
    } catch (error) {
      console.error(error)
      res.status(400).json({ error: 'an unknown error occurred' })
      return
    }
  }

  res.status(405).json({})
})
