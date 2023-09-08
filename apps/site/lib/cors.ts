import { NextApiRequest, NextApiResponse } from 'next'

export function setupCors(req: NextApiRequest, res: NextApiResponse) {
  const origin = req.headers.origin
  console.log({ origin })
  if (
    typeof origin === 'string' &&
    (origin.endsWith('tamagui.dev') || origin.endsWith('localhost:1421'))
  ) {
    console.warn('hit')
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Access-Control-Allow-Credentials', 'true')
  }
}
