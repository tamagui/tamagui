import { apiRoute } from '@lib/apiRoute'
import { authorizeUserAccess } from '@lib/authorizeUserAccess'
import { protectApiRoute } from '@lib/protectApiRoute'
import fs from 'fs'
import path from 'path'

function getFilePath(codePath: string) {
  if (process.env.NODE_ENV === 'development' && process.env.IS_TAMAGUI_DEV === '1') {
    return path.join(process.cwd(), '.next/bento', codePath + '.txt')
  }
  return path.join(process.cwd(), '../bento/src/components', codePath + '.tsx')
}

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
  const filePath = getFilePath(codePath)

  try {
    const fileBuffer = fs.readFileSync(filePath)
    res.setHeader('Content-Type', 'text/plain')
    return res.send(fileBuffer)
  } catch (error) {
    console.error(error)
    res.status(404).json({ error: 'Not found' })
    return
  }
})

export default handler
