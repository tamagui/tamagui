import type { Endpoint } from 'one'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getQuery } from '~/features/api/getQuery'
import { getBentoCode, supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { hasProAccess } from '~/features/bento/hasProAccess'
import { isTailwindMode } from '~/features/docs/isTailwindMode'

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

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const codePath = `${query.section}/${query.part}/${query.fileName}`
  const fileName = `${query.fileName}`

  // CLI
  if (query.userGithubId) {
    const hasPro = await hasProAccess(`${query.userGithubId}`)
    if (!hasPro) {
      return Response.json({ error: `no_access` }, { status: 500 })
    }
    const code = await getBentoCode(codePath)
    return new Response(maybeTransformToTailwind(code, req), {
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    })
  }

  // OSS component
  if (OSS_COMPONENTS.includes(fileName)) {
    const code = await getBentoCode(codePath)
    return new Response(maybeTransformToTailwind(code, req), {
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  // Authorize
  const { user } = await ensureAuth({ req })
  const { hasPro } = await ensureAccess({ user })
  if (!hasPro) {
    return Response.json({ error: 'Must have Pro account' }, { status: 403 })
  }

  const fileResult = await supabaseAdmin.storage
    .from('bento')
    .download(`merged/${codePath}.tsx`)

  if (fileResult.error) {
    console.error(fileResult.error)
    return Response.json(
      { message: 'Not found' },
      {
        status: 404,
      }
    )
  }

  const code = await fileResult.data.text()
  return new Response(maybeTransformToTailwind(code, req), {
    headers: {
      'content-type': 'text/plain',
    },
  })
}

export const OSS_COMPONENTS = [
  'InputWithLabel',
  'CheckboxCards',
  'SignInScreen',
  'GroupedRadio',
  'SwitchCustomIcons',
  'WritePreviewAction',
  'ImagePicker',
  'HList',
  'AvatarsGrouped',
  'ButtonsWithLeftIcons',
  'DatePicker',
  'UsersTable',
  'Chips',
  'SlidingPopover',
  'TabBar',
  'ButtonLoading',
  'NumberSlider',
  'SlideIn',
  'AvatarsTooltip',
  'Meeting',
]
