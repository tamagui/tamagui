import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { ProductName } from '~/shared/types/subscription'
import { getSubscriptions } from '../user/helpers'

export const hasBentoAccess = async (userId: string) => {
  const subscriptions = await getSubscriptions(userId)

  // Check for current subscription-based access
  const hasSubscriptionAccess = Boolean(
    subscriptions?.some((subscription) =>
      subscription.subscription_items?.some((item) =>
        item.price?.product?.name?.includes(ProductName.TamaguiPro)
      )
    )
  )

  if (hasSubscriptionAccess) {
    return true
  }

  // Check for legacy lifetime access
  return await hasLegacyBentoAccess(userId)
}

const hasLegacyBentoAccess = async (userId: string) => {
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

  if (!result?.data?.length) {
    return false
  }

  // Check for direct Bento product ownership
  const hasDirectBentoAccess = result.data.some(
    (ownership) => ownership.prices?.products?.name === ProductName.TamaguiBento
  )

  if (hasDirectBentoAccess) {
    return true
  }

  // Check for legacy lifetime purchases (product metadata.is_lifetime = "1")
  // These are old Bento lifetime purchases that may show as PRO product but have lifetime metadata
  const hasLifetimeAccess = result.data.some((ownership) => {
    const productMetadata = ownership.prices?.metadata as Record<string, any> | null
    return productMetadata?.is_lifetime === '1'
  })

  return hasLifetimeAccess
}
