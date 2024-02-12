import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import fs from 'fs'
import path from 'path'

const handler = apiRoute(async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
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
  }
  const slugsArray = Array.isArray(req.query.slug)
    ? req.query.slug
    : typeof req.query.slug === 'string'
      ? [req.query.slug]
      : []
  const codePath = slugsArray.join('/')
  const filePath = path.resolve('./bento-output', codePath)
  // temporary log for debugging prod
  console.info({
    codePath,
    cwdDir: fs.readdirSync(path.join(process.cwd())),
  })

  const fileBuffer = fs.readFileSync(filePath + '.txt')
  res.setHeader('Content-Type', 'text/plain')
  return res.send(fileBuffer)
})

export default handler
