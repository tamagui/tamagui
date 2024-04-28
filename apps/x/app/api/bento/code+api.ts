import type { Endpoint } from '@vxrn/router'
import { authorizeUserAccess } from '~/features/api/authorizeUserAccess'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getBentoCode, supabaseAdmin } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async (req) => {
  const { supabase } = await ensureAuth(req)
  await authorizeUserAccess(
    {
      req,
      supabase,
    },
    {
      checkForBentoAccess: true,
    }
  )

  const url = new URL(req.url)

  console.warn('TODODOODO')

  const slugsArray = [url.searchParams.get('slug')]
  // const slugsArray = Array.isArray(req.query.slug)
  //   ? req.query.slug
  //   : typeof req.query.slug === 'string'
  //     ? [req.query.slug]
  //     : []

  const codePath = slugsArray.join('/')

  if (OSS_COMPONENTS.includes(slugsArray[slugsArray.length - 1]!)) {
    const fileResult = await getBentoCode(codePath)
    return new Response(fileResult, {
      headers: {
        'content-type': 'text/plain',
      },
    })
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
