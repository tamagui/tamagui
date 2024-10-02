import type { Endpoint } from 'one'
import { getQuery } from '~/features/api/getQuery'
import { getBentoComponentCategory } from '~/features/auth/supabaseAdmin'
import { hasBentoAccess } from '~/features/bento/hasBentoAccess'
import { OSS_COMPONENTS } from './code+api'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const fileName = Array.isArray(query.fileName) ? query.fileName[0] : query.fileName

  // Extract the token from the Authorization header
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return Response.json({ error: 'no_token_provided' }, { status: 401 })
  }

  // Validate the token
  const { data: user, error } = await supabaseAdmin.auth.getUser(token)
  if (error || !user) {
    return Response.json({ error: 'invalid_token' }, { status: 401 })
  }

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

  // Check Bento access
  const resultHasBentoAccess = await hasBentoAccess(user.user.id)
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
