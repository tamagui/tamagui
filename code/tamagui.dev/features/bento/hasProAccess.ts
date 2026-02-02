import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { ProductName } from '~/shared/types/subscription'
import { getSubscriptions } from '../user/helpers'

/**
 * Check if a user has Pro access via subscription, legacy product ownership, or whitelist
 * Runs all checks in parallel for speed
 */
export const hasProAccess = async (userId: string) => {
  // run all checks in parallel
  const [subscriptions, legacyAccess, whitelistAccess] = await Promise.all([
    getSubscriptions(userId),
    hasLegacyAccess(userId),
    hasWhitelistAccess(userId),
  ])

  // check whitelist first (fastest path for gifted users)
  if (whitelistAccess) {
    return true
  }

  // check for current subscription-based access (active or trialing)
  const validProProducts = [
    ProductName.TamaguiPro,
    ProductName.TamaguiProV2,
    ProductName.TamaguiProV2Upgrade,
    ProductName.TamaguiSupportDirect,
    ProductName.TamaguiSupportSponsor,
  ]

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
  return legacyAccess
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

/**
 * Check if user is on the pro whitelist by their github username
 * Uses a single joined query for efficiency
 */
const hasWhitelistAccess = async (userId: string): Promise<boolean> => {
  // get github username and check whitelist in parallel via a single query pattern
  const userResult = await supabaseAdmin
    .from('users_private')
    .select('github_user_name')
    .eq('id', userId)
    .single()

  const githubUsername = userResult.data?.github_user_name
  if (!githubUsername) {
    return false
  }

  // check if they're on the whitelist (case-insensitive)
  const whitelistResult = await supabaseAdmin
    .from('pro_whitelist')
    .select('id')
    .ilike('github_username', githubUsername)
    .limit(1)
    .maybeSingle()

  return !!whitelistResult.data
}

// backwards compat alias
export const hasBentoAccess = hasProAccess
