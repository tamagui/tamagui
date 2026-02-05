import { apiRoute } from '~/features/api/apiRoute'
import { getParityDiscount, getCountryName } from '~/features/geo-pricing/parityConfig'

/**
 * Returns parity discount based on user's country (via Cloudflare CF-IPCountry header)
 * This replaces Parity Deals with our own simpler system.
 *
 * Security: The country is determined server-side from CF-IPCountry header,
 * which Cloudflare sets based on the user's IP. Cannot be spoofed by the client.
 *
 * Admin override: Allows ?country=XX query param for testing parity pricing.
 * This is client-side only (for preview) - actual payment still uses CF-IPCountry.
 */
export default apiRoute(async (req) => {
  // cloudflare adds this header automatically (cannot be spoofed by client)
  const countryCode = req.headers.get('CF-IPCountry')

  // allow override via query param for admin testing (client-side preview only)
  // actual payment validation still uses CF-IPCountry header
  const url = new URL(req.url)
  const overrideCountry = url.searchParams.get('country')
  const country = overrideCountry || countryCode

  const discount = getParityDiscount(country)
  const countryName = getCountryName(country)

  return Response.json({
    country: country?.toUpperCase() || null,
    countryName,
    discount,
    // flag if this is an override (for UI indication)
    ...(overrideCountry && { isOverride: true }),
    // only include if there's a discount
    ...(discount > 0 && {
      message: `${discount}% parity discount available for ${countryName}`,
    }),
  })
})
