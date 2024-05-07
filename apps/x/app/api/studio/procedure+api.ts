import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

export default apiRoute(async (req) => {
  const apis = await import('@tamagui/studio/api')

  const { supabase } = await ensureAuth({ req })

  await ensureAccess(
    {
      req,
      supabase,
    },
    {
      checkForStudioAccess: true,
    }
  )

  const procedureName = req.query.procedure

  if (req.method === 'POST') {
    if (typeof procedureName !== 'string') {
      return Response.json(
        { error: '`procedure` query param is not provided / incorrect.' },
        { status: 400 }
      )
    }

    if (!(procedureName in apis)) {
      return Response.json(
        { error: `No procedure found: ${procedureName}` },
        { status: 400 }
      )
    }

    try {
      return Response.json(await apis[procedureName](JSON.parse(req.body)))
    } catch (error) {
      console.error(error)
      return Response.json({ error: 'an unknown error occurred' }, { status: 400 })
    }
  }

  return Response.json(
    {},
    {
      status: 405,
    }
  )
})
