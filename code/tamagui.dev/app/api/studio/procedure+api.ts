import { apiRoute } from '~/features/api/apiRoute'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getQuery } from '~/features/api/getQuery'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import * as APIs from '~/features/studio/api'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  const { hasPro } = await ensureAccess({ user })
  if (!hasPro) {
    return Response.json({ error: 'Must have Pro account' }, { status: 403 })
  }

  const query = getQuery(req)
  const procedureName = query.procedure

  if (req.method === 'POST') {
    if (typeof procedureName !== 'string') {
      return Response.json(
        { error: '`procedure` query param is not provided / incorrect.' },
        { status: 400 }
      )
    }

    if (!(procedureName in APIs)) {
      return Response.json(
        { error: `No procedure found: ${procedureName}` },
        { status: 400 }
      )
    }

    try {
      return Response.json(await APIs[procedureName](await readBodyJSON(req)))
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
