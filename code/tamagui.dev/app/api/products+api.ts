import { apiRoute } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { getArray } from '~/helpers/getArray'

export default apiRoute(async () => {
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
      return Response.json({ error: 'No products found' }, { status: 404 })
    }

    for (const product of products) {
      if (product.error) {
        return Response.json({ error: product.error }, { status: 500 })
      }
      if (
        !product.data.prices ||
        !Array.isArray(product.data.prices) ||
        product.data.prices.length === 0
      ) {
        return Response.json(
          { error: 'No prices are attached to the product.' },
          { status: 404 }
        )
      }
    }

    return Response.json({
      starter: {
        ...products[0].data!,
        name: 'Takeout',
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
    })
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    )
  }
})

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
