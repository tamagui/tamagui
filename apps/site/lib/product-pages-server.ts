import type Stripe from 'stripe'
import { stripe } from './stripe'
import type { Database } from './supabase-types'
import { getArray } from './supabase-utils'
import { supabaseAdmin } from './supabaseAdmin'

export const getProductsForServerSideRendering = async (): Promise<{
  starter: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  iconsPack: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  fontsPack: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  bento: Database['public']['Tables']['products']['Row'] & {
    prices: Database['public']['Tables']['prices']['Row'][]
  }
  defaultCoupon?: Stripe.Coupon | null
  takeoutPlusBentoCoupon?: Stripe.Coupon | null
}> => {
  const defaultSitePromotionCodePromise = stripe.promotionCodes.list({
    code: 'SITE', // ones with code SITE are considered public and will be shown here
    active: true,
    expand: ['data.coupon'],
  })
  const takeoutPlusBentoPromotionCodePromise = stripe.promotionCodes.list({
    code: 'TAKEOUTPLUSBENTO', // ones with code TAKEOUTPLUSBENTO are considered public and will be shown here
    active: true,
    expand: ['data.coupon'],
  })
  const productPromises = [
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'universal-starter')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'icon-packs')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'font-packs')
      .single(),
    supabaseAdmin
      .from('products')
      .select('*, prices(*)')
      .eq('metadata->>slug', 'bento')
      .single(),
  ]
  const promises = [
    defaultSitePromotionCodePromise,
    takeoutPlusBentoPromotionCodePromise,
    ...productPromises,
  ]
  const queries = await Promise.all(promises)

  // slice(2) because the first two are coupon info
  const products = queries.slice(2) as Awaited<(typeof productPromises)[number]>[]
  const defaultCouponList = queries[0] as Awaited<typeof defaultSitePromotionCodePromise>
  const takeoutPlusBentoCouponList = queries[1] as Awaited<
    typeof takeoutPlusBentoPromotionCodePromise
  >

  let defaultCoupon: Stripe.Coupon | null = null

  if (defaultCouponList.data.length > 0) {
    defaultCoupon = defaultCouponList.data[0].coupon
  }

  let takeoutPlusBentoCoupon: Stripe.Coupon | null = null

  if (takeoutPlusBentoCouponList.data.length > 0) {
    takeoutPlusBentoCoupon = takeoutPlusBentoCouponList.data[0].coupon
  }

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
      prices: getArray(products[0].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    iconsPack: {
      ...products[1].data!,
      prices: getArray(products[1].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    fontsPack: {
      ...products[2].data!,
      prices: getArray(products[2].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    bento: {
      ...products[3].data!,
      prices: getArray(products[3].data!.prices!).filter(
        (p) => p.active && !(p.metadata as Record<string, any>).hide_from_lists
      ),
    },
    defaultCoupon,
    takeoutPlusBentoCoupon,
  }
}
