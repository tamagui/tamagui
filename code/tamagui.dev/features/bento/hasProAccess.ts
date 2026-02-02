import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { ProductName } from '~/shared/types/subscription'
import { getSubscriptions } from '../user/helpers'

/**
 * Check if a user has Pro access via subscription or legacy product ownership
 */
export const hasProAccess = async (userId: string) => {
  const subscriptions = await getSubscriptions(userId)

  const validProProducts = [
    ProductName.TamaguiPro,
    ProductName.TamaguiProV2,
    ProductName.TamaguiProV2Upgrade,
    ProductName.TamaguiSupportDirect,
    ProductName.TamaguiSupportSponsor,
  ]

  // check for current subscription-based access (active or trialing)
  const hasSubscriptionAccess = subscriptions?.some((subscription) => {
    const isActiveOrTrialing =
      subscription.status === 'active' || subscription.status === 'trialing'
    const hasValidProduct = subscription.subscription_items?.some((item) => {
      const productName = item.price?.product?.name
      return validProProducts.some((product) => productName?.includes(product))
    })
    return isActiveOrTrialing && hasValidProduct
  })

  if (hasSubscriptionAccess) {
    return true
  }

  // check for legacy lifetime access
  return await hasLegacyAccess(userId)
}

const hasLegacyAccess = async (userId: string) => {
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

  // check for direct Bento product ownership (legacy)
  const hasDirectBentoAccess = result.data.some(
    (ownership) => ownership.prices?.products?.name === ProductName.TamaguiBento
  )

  if (hasDirectBentoAccess) {
    return true
  }

  // check for legacy lifetime purchases (product metadata.is_lifetime = "1")
  const hasLifetimeAccess = result.data.some((ownership) => {
    const productMetadata = ownership.prices?.metadata as Record<string, any> | null
    return productMetadata?.is_lifetime === '1'
  })

  return hasLifetimeAccess
}

// backwards compat alias
export const hasBentoAccess = hasProAccess
