import useSWR from 'swr'
import type { Database } from '~/features/supabase/types'

type Product = Database['public']['Tables']['products']['Row'] & {
  prices: Database['public']['Tables']['prices']['Row'][]
}

export type ProductsResponse = {
  starter: Product
  bento: Product
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
