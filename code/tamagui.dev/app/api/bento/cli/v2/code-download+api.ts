import type { Endpoint } from 'one'
import { getQuery } from '~/features/api/getQuery'
import { getBentoComponentCategory } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const first = (val: string | string[]) => (Array.isArray(val) ? val[0] : val)

  return Response.json(
    await getBentoComponentCategory({
      categoryPath: first(query.section),
      categorySectionPath: first(query.part),
      fileName: first(query.fileName),
    })
  )
}
