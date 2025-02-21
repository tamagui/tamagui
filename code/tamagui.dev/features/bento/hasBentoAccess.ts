import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export const hasBentoAccess = async (userId: string) => {
  const result = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      subscription_items (
        prices (
          *,
          products (
            name
          )
        )
      )
    `)
    .eq('user_id', userId)
  // .in('status', ['active', 'trialing'])

  return Boolean(
    result.data?.some((subscription) =>
      subscription.subscription_items?.some(
        (item) => item.prices?.products?.name === 'Tamagui Pro'
      )
    )
  )
}

export const hasBentoAccessV2 = async (userId: string) => {
  const result = await supabaseAdmin
    .from('product_ownership')
    .select(`
      *,
      prices (
        *,
        products (
          *
        )
      )
    `)
    .eq('user_id', userId)
    .eq('prices.products.name', 'Bento')

  return Boolean(result?.data?.length)
}
