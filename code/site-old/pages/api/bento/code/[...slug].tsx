import type { NextApiRequest, NextApiResponse } from 'next'

import { apiCliBentoRoute } from '@lib/apiCliBentoRoute'
import { apiOssBentoRoute } from '@lib/apiOssBentoRoute'
import { protectedAuthRoute } from '@lib/protectedAuthRoute'
import { OSS_COMPONENTS } from '@lib/constants'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.query.userGithubId) {
      await apiCliBentoRoute(req, res)
    } else if (isOSS(req)) {
      await apiOssBentoRoute(req, res)
    } else {
      await protectedAuthRoute(req, res)
    }
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
}

function isOSS(req: NextApiRequest) {
  const slugsArray = Array.isArray(req.query.slug)
    ? req.query.slug
    : typeof req.query.slug === 'string'
      ? [req.query.slug]
      : []
  const codePath = slugsArray.join('/')
  const isOSS = OSS_COMPONENTS.includes(slugsArray[slugsArray.length - 1])
  return isOSS
}
