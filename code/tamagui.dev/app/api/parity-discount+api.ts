import { apiRoute } from '~/features/api/apiRoute'
import { getParityDiscountResponse } from '~/features/geo-pricing/parityDiscountResponse'

/**
 * returns parity discount based on user's country (via Cloudflare CF-IPCountry header)
 * this replaces parity deals with our own simpler system.
 *
 * security: the country is determined from CF-IPCountry only when the request is
 * proven to have transited Cloudflare. this keeps the displayed discount aligned
 * with the charge path.
 *
 * admin override: allows ?country=XX query param for testing parity pricing.
 * this is client-side only (for preview) - actual payment still uses CF-IPCountry.
 */
export default apiRoute(async (req) => {
  return Response.json(getParityDiscountResponse(req))
})
