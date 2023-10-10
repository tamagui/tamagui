import { NextApiRequest, NextApiResponse } from 'next'

export function setupCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin

  if (
    typeof origin === 'string' &&
    (origin.endsWith('tamagui.dev') ||
      origin.endsWith('localhost:1421') ||
      origin.endsWith('stripe.com'))
  ) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
}
