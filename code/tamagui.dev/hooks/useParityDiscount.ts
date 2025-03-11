import { useMemo } from 'react'
import useSWR from 'swr'
import z from 'zod'

/**
 * Since we moved the Purchase page to a modal, we cannot set path based parity deals.
 * Therefore, we have to manually fetch the parity deals from the API and apply it to the purchase modal manually.
 * This hook is used to fetch the parity deals and apply it to the purchase modal.
 */
export const useParityDiscount = () => {
  const { data, error } = useSWR('/api/parity-discount', fetcher)

  const parityDeals = useMemo(() => {
    if (!data) return null
    const parsedData = ParityDealsSchema.safeParse(data)
    if (!parsedData.success) {
      console.error('Failed to parse parity deals', parsedData.error)
      return null
    }
    return parsedData.data
  }, [data])

  return { parityDeals, error }
}

const fetcher = async (url: string) => {
  const isLocal = process.env.NODE_ENV === 'development'
  const baseUrl = isLocal
    ? `${window.location.origin}/api/parity-discount`
    : `https://api.paritydeals.com/api/v1/deals/discount/?url=${window.location.origin}`

  const response = await fetch(baseUrl)
  const data = await response.json()
  return data
}

const ParityDealsSchema = z.object({
  couponCode: z.string(),
  discountPercentage: z.string(),
  countryFlag: z.string(),
  countryFlagSvg: z.string(),
})
