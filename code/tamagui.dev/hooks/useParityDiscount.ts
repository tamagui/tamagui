import { useEffect, useState } from 'react'

type ParityDiscount = {
  country: string | null
  countryName: string
  discount: number
}

// localStorage key for admin country override
export const PARITY_COUNTRY_OVERRIDE_KEY = 'admin_parity_country_override'

/**
 * Convert ISO country code to flag emoji
 * Each letter is offset to the regional indicator symbol range
 */
function countryCodeToFlag(countryCode: string | null): string {
  if (!countryCode || countryCode.length !== 2) return '🌍'
  const code = countryCode.toUpperCase()
  const offset = 127397 // regional indicator symbol 'A' minus 'A'
  return String.fromCodePoint(code.charCodeAt(0) + offset, code.charCodeAt(1) + offset)
}

/**
 * Get admin country override from localStorage
 */
export function getParityCountryOverride(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(PARITY_COUNTRY_OVERRIDE_KEY)
}

/**
 * Set admin country override in localStorage
 */
export function setParityCountryOverride(countryCode: string | null): void {
  if (typeof window === 'undefined') return
  if (countryCode) {
    localStorage.setItem(PARITY_COUNTRY_OVERRIDE_KEY, countryCode.toUpperCase())
  } else {
    localStorage.removeItem(PARITY_COUNTRY_OVERRIDE_KEY)
  }
  // dispatch storage event for other tabs/hooks to pick up
  window.dispatchEvent(new Event('storage'))
}

/**
 * Hook that fetches parity discount based on user's geo location.
 * Uses Cloudflare CF-IPCountry header on the server side.
 *
 * Supports admin override via localStorage for testing different countries.
 */
export const useParityDiscount = () => {
  const [parityDiscount, setParityDiscount] = useState<ParityDiscount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overrideCountry, setOverrideCountry] = useState<string | null>(null)

  // listen for override changes
  useEffect(() => {
    const checkOverride = () => {
      setOverrideCountry(getParityCountryOverride())
    }
    checkOverride()
    window.addEventListener('storage', checkOverride)
    return () => window.removeEventListener('storage', checkOverride)
  }, [])

  useEffect(() => {
    const fetchParityDiscount = async () => {
      try {
        // pass override as query param if set
        const url = overrideCountry
          ? `/api/parity-discount?country=${overrideCountry}`
          : '/api/parity-discount'
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch parity discount')
        }
        const data = await response.json()

        // only set if there's actually a discount
        if (data.discount > 0) {
          setParityDiscount(data)
        } else {
          setParityDiscount(null)
        }
      } catch (err) {
        console.error('Error fetching parity discount:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchParityDiscount()
  }, [overrideCountry])

  // backwards compat + enhanced shape
  const parityDeals = parityDiscount
    ? {
        country: parityDiscount.countryName,
        countryCode: parityDiscount.country,
        discountPercentage: String(parityDiscount.discount),
        flag: countryCodeToFlag(parityDiscount.country),
        // no coupon code needed - we apply discount directly
        couponCode: null as string | null,
      }
    : null

  return {
    parityDeals,
    parityDiscount,
    isLoading,
    error,
  }
}
