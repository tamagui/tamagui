import { useEffect, useState } from 'react'

type ParityDiscount = {
  country: string | null
  countryName: string
  discount: number
}

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
 * Hook that fetches parity discount based on user's geo location.
 * Uses Cloudflare CF-IPCountry header on the server side.
 *
 * Replaces the old Parity Deals banner scraping approach.
 */
export const useParityDiscount = () => {
  const [parityDiscount, setParityDiscount] = useState<ParityDiscount | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchParityDiscount = async () => {
      try {
        const response = await fetch('/api/parity-discount')
        if (!response.ok) {
          throw new Error('Failed to fetch parity discount')
        }
        const data = await response.json()

        // only set if there's actually a discount
        if (data.discount > 0) {
          setParityDiscount(data)
        }
      } catch (err) {
        console.error('Error fetching parity discount:', err)
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchParityDiscount()
  }, [])

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
