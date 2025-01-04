import { setResponseHeaders } from 'one/server'

export const setupCors = (req: Request) => {
  const origin = req.headers.get('origin')

  if (isValidOrigin(origin)) {
    setResponseHeaders((headers) => {
      headers.set('Access-Control-Allow-Origin', origin)
      headers.set('Access-Control-Allow-Credentials', 'true')
      headers.set('Allow', 'GET, POST, PUT, DELETE, PATCH')
    })
  }
}

function isValidOrigin(origin?: string | null): origin is string {
  return (
    typeof origin === 'string' &&
    (origin === 'tamagui.dev' ||
      origin.endsWith('.tamagui.dev') ||
      origin === 'stripe.com' ||
      origin.endsWith('.stripe.com') ||
      origin.endsWith('localhost:1421'))
  )
}
