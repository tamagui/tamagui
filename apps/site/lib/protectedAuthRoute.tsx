import { HandledResponseTermination } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import { supabaseAdmin } from '@lib/supabaseAdmin'

export const protectedAuthRoute = async (req, res) => {
  const { supabase } = await protectApiRoute({ req, res })
  await authorizeUserAccess(
    {
      req,
      res,
      supabase,
    },
    {
      checkForBentoAccess: true,
    }
  )
  const slugsArray = Array.isArray(req.query.slug)
    ? req.query.slug
    : typeof req.query.slug === 'string'
      ? [req.query.slug]
      : []

  const codePath = slugsArray.join('/')

  const fileResult = await supabaseAdmin.storage
    .from('bento')
    .download(`merged/${codePath}.tsx`)
  if (fileResult.error) {
    console.error(fileResult.error)
    res.status(404).json({ message: 'Not found' })
    throw new HandledResponseTermination(`File ${codePath} not found`)
  }

  res.setHeader('Content-Type', 'text/plain')
  return res.send(await fileResult.data.text())
}
