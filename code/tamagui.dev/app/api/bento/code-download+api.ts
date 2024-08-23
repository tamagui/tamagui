import type { Endpoint } from 'vxs'
import { getQuery } from '~/features/api/getQuery'
import { getBentoComponentCategory } from '~/features/auth/supabaseAdmin'
import { hasBentoAccess } from '~/features/bento/hasBentoAccess'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const cliResponseVersion = Array.isArray(query.cliResponseVersion)
    ? query.cliResponseVersion[0]
    : query.cliResponseVersion

  // CLI Version 2
  if (query.userGithubId) {
    const resultHasBentoAccess = await hasBentoAccess(`${query.userGithubId}`)
    if (!resultHasBentoAccess) {
      return Response.json({ error: `no_access` }, { status: 500 })
    }
    return Response.json(
      await getBentoComponentCategory({
        categoryPath: Array.isArray(query.section) ? query.section[0] : query.section,
        categorySectionPath: Array.isArray(query.part) ? query.part[0] : query.part,
        fileName: Array.isArray(query.fileName) ? query.fileName[0] : query.fileName,
      })
    )
  }

  // If not CLI Version 2, return a 404 response
  return Response.json({ error: 'Not found' }, { status: 404 })
}
