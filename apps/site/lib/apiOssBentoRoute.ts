import type { NextApiHandler } from 'next'

import { OSS_COMPONENTS } from './constants'
import { getBentoCode } from './supabaseAdmin'
import type { NextApiRequest, NextApiResponse } from 'next'

export async function apiOssBentoRoute({req, res}: {req: NextApiRequest, res: NextApiResponse}) {
    const slugsArray = Array.isArray(req.query.slug)
      ? req.query.slug
      : typeof req.query.slug === 'string'
        ? [req.query.slug]
        : []
    const codePath = slugsArray.join('/')
    if (!OSS_COMPONENTS.includes(slugsArray[slugsArray.length - 1])) {
      throw new Error(`Not authed`)
    }
    const fileResult = await getBentoCode(codePath)
    res.setHeader('Content-Type', 'text/plain')
    res.send(fileResult)
    res.end()
  }
