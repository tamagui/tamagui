import { apiRoute } from '~/features/api/apiRoute'
import { authorizeUserAccess } from '~/features/api/authorizeUserAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

let apis

export default apiRoute(async (req) => {
  try {
    apis = await require('@tamagui/studio/api')
  } catch (error) {
    console.error('git-crypt is not unlocked. returning.', error)
    return Response.json(
      {},
      {
        status: 500,
      }
    )
  }

  const { supabase } = await ensureAuth({ req })

  await authorizeUserAccess(
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
