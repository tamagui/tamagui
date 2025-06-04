import { useEffect, useRef, useState } from 'react'
import z from 'zod'

const ParityDealsSchema = z.object({
  country: z.string(),
  couponCode: z.string(),
  discountPercentage: z.string(),
})

type ParityDeals = z.infer<typeof ParityDealsSchema>

/**
 * A hook that detects and extracts data from Parity Deals banner.
 * When the banner is detected, it extracts the country, coupon code, and discount information,
 * then removes the original banner from the DOM.
 *
 * @returns An object containing the extracted parity deals data
 * @example
 * ```tsx
 * const { parityDeals } = useParityDiscount()
 * if (parityDeals) {
 *   console.log(parityDeals.country, parityDeals.couponCode, parityDeals.discountPercentage)
 * }
 * ```
 */
export const useParityDiscount = () => {
  const observerRef = useRef<MutationObserver | null>(null)
  const [parityDeals, setParityDeals] = useState<ParityDeals | null>(null)

  /**
   * If the banner is present, the text is like this:
   * `Looks like you are from <b>Japan</b>. If you need it, use code <b>"pdsiurjf20"</b> to get <b>20%</b> off your subscription at checkout.`
   * This function extracts the country, coupon code, and discount percentage from the banner.
   */
  const extractParityData = (element: Element): ParityDeals | null => {
    const bannerInner = element.querySelector('.parity-banner-inner')
    if (!bannerInner) return null

    const boldElements = bannerInner.querySelectorAll('b')
    if (boldElements.length < 3) return null

    const [country, code, discount] = Array.from(boldElements).map((el) => el.textContent)

    if (!country || !code || !discount) return null

    const result = ParityDealsSchema.safeParse({
      country: country.trim(),
      couponCode: code.replace(/"/g, '').trim(),
      discountPercentage: discount.replace('%', '').trim(),
    })

    return result.success ? result.data : null
  }

  useEffect(() => {
    // Check for existing banner first
    const existingBanner = document.querySelector('.parity-banner')
    if (existingBanner instanceof HTMLElement) {
      const data = extractParityData(existingBanner)
      if (data) {
        setParityDeals(data)
        existingBanner.remove()
        return // No need to observe if we already found the banner
      }
    }

    // If no existing banner, observe for dynamically added ones
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement && node.classList.contains('parity-banner')) {
            const data = extractParityData(node)
            if (data) {
              setParityDeals(data)
              node.remove()
              observer.disconnect()
            }
          }
        })
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })

    observerRef.current = observer

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return { parityDeals }
}
