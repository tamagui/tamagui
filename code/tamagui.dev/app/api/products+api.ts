import { apiRoute } from '~/features/api/apiRoute'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { getArray } from '~/helpers/getArray'
import { ProductName } from '~/shared/types/subscription'

export default apiRoute(async () => {
  try {
    const products = await Promise.all([
      // V1 Products
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('name', ProductName.TamaguiPro)
        .single(),
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('name', ProductName.TamaguiSupport)
        .single(),
      // V2 Products
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('name', ProductName.TamaguiProV2)
        .single(),
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('name', ProductName.TamaguiSupportDirect)
        .single(),
      supabaseAdmin
        .from('products')
        .select('*, prices(*)')
        .eq('name', ProductName.TamaguiSupportSponsor)
        .single(),
    ])

    // Check V1 products (required)
    const [v1Pro, v1Support, v2Pro, v2SupportDirect, v2SupportSponsor] = products

    if (v1Pro.error || v1Support.error) {
      return Response.json({ error: v1Pro.error || v1Support.error }, { status: 500 })
    }

    if (!v1Pro.data?.prices?.length || !v1Support.data?.prices?.length) {
      return Response.json(
        { error: 'No prices are attached to the V1 products.' },
        { status: 404 }
      )
    }

    return Response.json({
      // V1 Products
      pro: {
        ...v1Pro.data!,
        prices: uniqueDescription(getArray(v1Pro.data!.prices!).filter((p) => p.active)),
      },
      support: {
        ...v1Support.data!,
        prices: uniqueDescription(
          getArray(v1Support.data!.prices!).filter((p) => p.active)
        ),
      },
      // V2 Products (optional - may not exist in all environments)
      proV2: v2Pro.data
        ? {
            ...v2Pro.data,
            prices: uniqueDescription(
              getArray(v2Pro.data.prices || []).filter((p) => p.active)
            ),
          }
        : null,
      supportDirect: v2SupportDirect.data
        ? {
            ...v2SupportDirect.data,
            prices: uniqueDescription(
              getArray(v2SupportDirect.data.prices || []).filter((p) => p.active)
            ),
          }
        : null,
      supportSponsor: v2SupportSponsor.data
        ? {
            ...v2SupportSponsor.data,
            prices: uniqueDescription(
              getArray(v2SupportSponsor.data.prices || []).filter((p) => p.active)
            ),
          }
        : null,
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
