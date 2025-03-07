import { apiRoute } from '~/features/api/apiRoute'

const PARITY_DISCOUNT_URL = `https://api.paritydeals.com/api/v1/deals/discount/`
const PD_IDENTIFIER = process.env.PD_IDENTIFIER

export default apiRoute(async (req) => {
  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] || // If the request is proxied through a proxy server
    req.headers['x-real-ip']?.toString() || // If the request is proxied through a proxy server
    req['connection']?.remoteAddress ||
    req['socket']?.remoteAddress ||
    '113.160.75.23'

  const url = new URL(PARITY_DISCOUNT_URL)
  url.searchParams.append('pd_identifier', PD_IDENTIFIER || '')
  url.searchParams.append('ip_address', ip)

  try {
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    return Response.json(data)
  } catch (error) {
    console.error('Parity Deals API error:', error)
    return Response.json({ error: 'Failed to fetch discount data' }, { status: 500 })
  }
})
