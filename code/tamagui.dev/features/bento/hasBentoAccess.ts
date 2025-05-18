import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { ProductName } from '~/shared/types/subscription'
import { getSubscriptions } from '../user/helpers'

export const hasBentoAccess = async (userId: string) => {
  const subscriptions = await getSubscriptions(userId)

  return Boolean(
    subscriptions?.some((subscription) =>
      subscription.subscription_items?.some((item) =>
        item.price?.product?.name?.includes(ProductName.TamaguiPro)
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
