import type { Database } from '~/features/supabase/types'
import { getArray } from '~/helpers/getArray'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export const getProductsForServerSideRendering = async (): Promise<{
  starter: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  bento: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
}> => {
  try {
    const products = await Promise.all([
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('metadata->>slug', 'universal-starter')
        .single(),
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('metadata->>slug', 'bento')
        .single(),
    ])

    if (!products.length) {
      throw new Error(`No products found`)
    }

    for (const product of products) {
      if (product.error) throw product.error
      if (
        !product.data.prices ||
        !Array.isArray(product.data.prices) ||
        product.data.prices.length === 0
      ) {
        throw new Error('No prices are attached to the product.')
      }
    }

    return {
      starter: {
        ...products[0].data!,
        name: `Takeout`,
        prices: uniqueDescription(
          getArray(products[0].data!.prices!).filter(
            (p) => p.active && (p.metadata as Record<string, any>).is_live
          )
        ),
      },
      bento: {
        ...products[1].data!,
        prices: uniqueDescription(
          getArray(products[1].data!.prices!).filter(
            (p) => p.active && (p.metadata as Record<string, any>).is_live
          )
        ),
      },
    }
  } catch (err) {
    // supabase returns a weird ass non-standard err
    if (!(err instanceof Error)) {
      throw new Error(`Supabase error: ${(err as any)['details']}`)
    }
    throw err
  }
}

const uniqueDescription = <A extends { description?: string | null }>(
  prices: A[]
): A[] => {
  const res: A[] = []
  for (const price of prices) {
    if (!res.some((x) => x.description === price.description)) {
      res.push(price)
    }
  }
  return res
}
