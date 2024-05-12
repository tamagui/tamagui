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

    if (!OSS_COMPONENTS.includes(slugsArray[slugsArray.length - 1])) {
      return handler(req, res)
    }

    try {
      const fileResult = await getBentoCode(codePath)
      res.setHeader('Content-Type', 'text/plain')
      res.send(fileResult)
    } catch (err) {
      const message = err instanceof Error ? err.message : `${err}`
      console.error(`Error serving API Route: ${message}`, err.stack)
      res.status(401).json({
        error: message,
      })
    }
  }
}
