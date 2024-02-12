import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import fs from 'fs'
import path from 'path'

const CODE_ASSETS_DIR = './.next/bento'
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
  const filePath = path.join(process.cwd(), CODE_ASSETS_DIR, codePath)
  if (!filePath.startsWith(path.resolve(CODE_ASSETS_DIR))) {
    res.status(404).json({ error: 'Not found' })
  }
  const fileBuffer = fs.readFileSync(filePath + '.txt')
  res.setHeader('Content-Type', 'text/plain')
  return res.send(fileBuffer)
})

export default handler
