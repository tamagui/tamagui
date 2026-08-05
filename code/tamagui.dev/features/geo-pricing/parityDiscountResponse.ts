import { getCountryName, getParityDiscount } from './parityConfig'
import { getTrustedCountryCode } from './trustedCountry'

export function getParityDiscountResponse(req: Request) {
  const url = new URL(req.url)
  const overrideCountry = url.searchParams.get('country')
  const country = overrideCountry || getTrustedCountryCode(req)
  const discount = getParityDiscount(country)
  const countryName = getCountryName(country)

  return {
    country: country?.toUpperCase() || null,
    countryName,
    discount,
    ...(overrideCountry && { isOverride: true }),
    ...(discount > 0 && {
      message: `${discount}% parity discount available for ${countryName}`,
    }),
  }
}
