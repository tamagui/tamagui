import useSWR from 'swr'
import type { Database } from '~/features/supabase/types'

type Product = Database['public']['Tables']['products']['Row'] & {
  prices: Database['public']['Tables']['prices']['Row'][]
}

export type ProductsResponse = {
  // V1 Products (required)
  pro: Product
  support: Product
  // V2 Products (optional - may not exist in all environments)
  proV2: Product | null
  supportDirect: Product | null
  supportSponsor: Product | null
}

export const useProducts = () => {
  return useSWR('products', {
    fetcher: async () => {
      const response = await fetch('/api/products')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      return response.json() as Promise<ProductsResponse>
    },
  })
}
