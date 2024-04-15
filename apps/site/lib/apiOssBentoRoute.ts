import type { NextApiHandler } from 'next'

import { OSS_COMPONENTS } from './constants'
import { getBentoCode } from './supabaseAdmin'

export function apiOssBentoRoute(handler: NextApiHandler) {
  return async (req, res) => {
    const slugsArray = Array.isArray(req.query.slug)
      ? req.query.slug
      : typeof req.query.slug === 'string'
        ? [req.query.slug]
        : []

    const codePath = slugsArray.join('/')

    try {
      if (!OSS_COMPONENTS.includes(slugsArray[slugsArray.length - 1])) {
        console.log('not a OSS component')
        return handler(req, res)
      } else {
        console.log('it IS a OSS component')
        const fileResult = await getBentoCode(codePath)
        res.setHeader('Content-Type', 'text/plain')
        res.send(fileResult)
        return
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : `${err}`
      console.error(`Error serving API Route: ${message}`, err.stack)
      res.status(403).json({
        error: message,
      })
    }
  }
}
