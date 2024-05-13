// @ts-nocheck
import type { NextApiHandler } from 'next'
import { getBentoCode, supabaseAdmin } from './supabaseAdmin'

const hasBentoAccess = async (githubId: string) => {
  const result = await supabaseAdmin.rpc('has_bento_access', {github_id_input: githubId})
  return Boolean(result?.data?.length)
}

export function apiCliBentoRoute(handler: NextApiHandler) {
  return async (req, res) => {
    if (!req.query.userGithubId) return handler(req, res)

    const resultHasBentoAccess = await hasBentoAccess(req.query.userGithubId)

    if(!resultHasBentoAccess) {
      throw new Error('No bento access from CLI')
    }

    const slugsArray = Array.isArray(req.query.slug)
      ? req.query.slug
      : typeof req.query.slug === 'string'
        ? [req.query.slug]
        : []

    const codePath = slugsArray.join('/')

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
