import { apiRoute } from '~/features/api/apiRoute'
import { getParityDiscount, getCountryName } from '~/features/geo-pricing/parityConfig'

/**
 * Returns parity discount based on user's country (via Cloudflare CF-IPCountry header)
 * This replaces Parity Deals with our own simpler system.
 *
 * Security: The country is determined server-side from CF-IPCountry header,
 * which Cloudflare sets based on the user's IP. Cannot be spoofed by the client.
 */
export default apiRoute(async (req) => {
  // cloudflare adds this header automatically (cannot be spoofed by client)
  const countryCode = req.headers.get('CF-IPCountry')

  // for local dev only, allow override via query param
  const url = new URL(req.url)
  const debugCountry =
    process.env.NODE_ENV === 'development' ? url.searchParams.get('country') : null
  const country = debugCountry || countryCode

  const discount = getParityDiscount(country)
  const countryName = getCountryName(country)

  return Response.json({
    country: country?.toUpperCase() || null,
    countryName,
    discount,
    // only include if there's a discount
    ...(discount > 0 && {
      message: `${discount}% parity discount available for ${countryName}`,
    }),
  })
})
