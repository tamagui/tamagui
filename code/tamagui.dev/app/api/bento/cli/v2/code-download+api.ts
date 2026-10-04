import type { Endpoint } from 'one'
import { getQuery } from '~/features/api/getQuery'
import { listBentoGroupFiles } from '~/features/bento/bentoSource'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const first = (val: string | string[]) => (Array.isArray(val) ? val[0] : val)
  // older bento-get releases still ask for `product_list`
  const part = first(query.part)?.replaceAll('_', '-')
  const groups = listBentoGroupFiles(first(query.section), part, first(query.fileName))
  const origin = new URL(req.url).origin

  return Response.json(
    Object.fromEntries(
      Object.entries(groups).map(([dir, paths]) => [
        dir,
        paths.map((path) => ({
          path,
          downloadUrl: `${origin}/api/bento/code?${new URLSearchParams({ path })}`,
        })),
      ])
    )
  )
}
