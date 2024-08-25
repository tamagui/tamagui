import type { Endpoint } from 'vxs'
import { getQuery } from '~/features/api/getQuery'
import { getBentoComponentCategory } from '~/features/auth/supabaseAdmin'
import { hasBentoAccess } from '~/features/bento/hasBentoAccess'
import { OSS_COMPONENTS } from './code+api'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const cliResponseVersion = Array.isArray(query.cliResponseVersion)
    ? query.cliResponseVersion[0]
    : query.cliResponseVersion

  const fileName = Array.isArray(query.fileName) ? query.fileName[0] : query.fileName

  // Check if it's an OSS component
  if (OSS_COMPONENTS.includes(fileName)) {
    return Response.json(
      await getBentoComponentCategory({
        categoryPath: Array.isArray(query.section) ? query.section[0] : query.section,
        categorySectionPath: Array.isArray(query.part) ? query.part[0] : query.part,
        fileName: fileName,
      })
    )
  }

  // CLI Version 2
  if (query.userGithubId) {
    const resultHasBentoAccess = await hasBentoAccess(`${query.userGithubId}`)
    if (!resultHasBentoAccess) {
      return Response.json({ error: 'not_authorized' }, { status: 401 })
    }
    return Response.json(
      await getBentoComponentCategory({
        categoryPath: Array.isArray(query.section) ? query.section[0] : query.section,
        categorySectionPath: Array.isArray(query.part) ? query.part[0] : query.part,
        fileName: fileName,
      })
    )
  }

  // If not CLI Version 2 and not an OSS component, return a not authorized response
  return Response.json({ error: 'not_authorized' }, { status: 401 })
}
