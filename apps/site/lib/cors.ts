import type { NextApiRequest, NextApiResponse } from 'next'

export function setupCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin

  if (isValidOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
    res.setHeader('Allow', 'GET, POST, PUT, DELETE, PATCH')
  }
}

function isValidOrigin(origin?: string): origin is string {
  return (
    typeof origin === 'string' &&
    (origin === 'tamagui.dev' ||
      origin.endsWith('.tamagui.dev') ||
      origin === 'stripe.com' ||
      origin.endsWith('.stripe.com') ||
      origin.endsWith('localhost:1421'))
  )
}
