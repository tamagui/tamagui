import type { Endpoint } from 'one'
import { getQuery } from '~/features/api/getQuery'
import { getBentoCode } from '~/features/auth/supabaseAdmin'
import { isTailwindMode } from '~/features/docs/isTailwindMode'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const code = await getBentoCode(`${query.section}/${query.part}/${query.fileName}`)

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
