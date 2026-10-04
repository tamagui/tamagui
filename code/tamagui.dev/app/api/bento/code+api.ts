import type { Endpoint } from 'one'
import { getQuery } from '~/features/api/getQuery'
import { getBentoFile, getMergedBentoSource } from '~/features/bento/bentoSource'
import { isTailwindMode } from '~/features/docs/isTailwindMode'

// ?section&part&fileName: one component with its local imports merged in (code tab)
// ?path: a single file as bento-get installs it
export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const code =
    typeof query.path === 'string'
      ? getBentoFile(query.path)
      : getMergedBentoSource(`${query.section}`, `${query.part}`, `${query.fileName}`)

  if (code === null) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(maybeTransformToTailwind(code, req), {
    headers: { 'content-type': 'text/plain' },
  })
}

// transform source code to tailwind if requested
function maybeTransformToTailwind(source: string, req: Request): string {
  if (!isTailwindMode({ request: req, search: new URL(req.url).search })) {
    return source
  }
  try {
    const { tamaguiToTailwind } = require('@tamagui/to-tailwind')
    return tamaguiToTailwind(source)
  } catch {
    return source
  }
}
