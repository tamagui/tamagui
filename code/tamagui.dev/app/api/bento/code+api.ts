import type { Endpoint } from 'one'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getQuery } from '~/features/api/getQuery'
import { getBentoCode, supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { hasBentoAccess } from '~/features/bento/hasBentoAccess'

export const GET: Endpoint = async (req) => {
  const query = getQuery(req)
  const codePath = `${query.section}/${query.part}/${query.fileName}`
  const fileName = `${query.fileName}`

  // CLI
  if (query.userGithubId) {
    const resultHasBentoAccess = await hasBentoAccess(`${query.userGithubId}`)
    if (!resultHasBentoAccess) {
      return Response.json({ error: `no_access` }, { status: 500 })
    }
    return new Response(await getBentoCode(codePath), {
      headers: new Headers({
        'Content-Type': 'text/plain',
      }),
    })
  }

  // OSS component
  if (OSS_COMPONENTS.includes(fileName)) {
    const fileResult = await getBentoCode(codePath)
    return new Response(fileResult, {
      headers: {
        'content-type': 'text/plain',
      },
    })
  }

  // Authorize
  const { supabase } = await ensureAuth({ req })
  await ensureAccess({
    req,
    supabase,
    checkForBentoAccess: true,
  })

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

  return new Response(await fileResult.data.text(), {
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
