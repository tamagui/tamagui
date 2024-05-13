import { apiCliBentoRoute } from '@lib/apiCliBentoRoute'
import { apiOssBentoRoute } from '@lib/apiOssBentoRoute'
import { HandledResponseTermination, apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import { supabaseAdmin } from '@lib/supabaseAdmin'

const handler = apiCliBentoRoute(
  apiOssBentoRoute(async (req, res) => {
    const { query } = req
    try {
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
    } catch (err) {
      if (
        err.message.includes('Not authed') ||
        err.message.includes(`User doesn't have access to Bento.`)
      ) {
        res.status(401).json({
          error: err.message,
        })
      } else {
        res.status(403).json({
          error: err.message,
        })
      }
    }
  })
)

export default handler
