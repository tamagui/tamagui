import type { User } from '@supabase/supabase-js'
import {
  whitelistBentoUsernames,
  whitelistGithubUsernames,
} from '~/features/github/helpers'
import { getArray } from '~/helpers/getArray'
import { getSingle } from '~/helpers/getSingle'
import { ProductName, ProductSlug, SubscriptionStatus } from '~/shared/types/subscription'
import { supabaseAdmin } from '../auth/supabaseAdmin'
import { hasProAccess } from '../bento/hasProAccess'
import { tiersPriority } from '../stripe/tiers'
import { ThemeSuiteSchema } from '../studio/theme/getTheme'
import type { ThemeSuiteItemData } from '../studio/theme/types'

export const getUserDetails = async (userId: string) => {
  const result = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data
}

export const getUserPrivateInfo = async (userId: string) => {
  const result = await supabaseAdmin
    .from('users_private')
    .select('*')
    .eq('id', userId)
    .limit(1)

  if (result.error) {
    throw new Error(`Error getting user private info: ${result.error.message}`)
  }

  return result.data?.[0] || {}
}

export const getUserTeams = async (userId: string) => {
  // replicate RLS: only return teams where user has a membership
  const { data: memberships } = await supabaseAdmin
    .from('memberships')
    .select('team_id')
    .eq('user_id', userId)
  const teamIds = (memberships || []).map((m) => m.team_id)
  if (teamIds.length === 0) return []
  const result = await supabaseAdmin.from('teams').select('*').in('id', teamIds)
  if (result.error) throw new Error(result.error.message)
  return result.data
}

export const getActiveSubscriptions = async (
  userId?: string,
  subscriptionId?: string
) => {
  const subscriptions = await getSubscriptions(userId)
  return subscriptions.find((s) => s.id && s.id === subscriptionId)
}

export const getAllActiveSubscriptions = async (userId: string) => {
  const result = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      subscription_items (
        *,
        price:prices (
          *,
          product:products (*)
        )
      )
    `)
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data
}

export const getSubscriptions = async (uuid?: string) => {
  let userId = uuid

  if (!userId) {
    return []
  }

  //NOTE: check user is a team member
  const { data: teamMember } = await supabaseAdmin
    .from('team_members')
    .select(`team_subscriptions (owner_id)`)
    .eq('member_id', userId)
    .eq('status', 'active')
    .single()

  // NOTE: if the user is a team member, we need to get the owner's id ===> to get the subscription
  const ownerId = teamMember?.team_subscriptions?.owner_id
  if (ownerId) userId = ownerId

  const select = '*, subscription_items(*, prices(*, products(*)), app_installations(*))'

  const result = await supabaseAdmin
    .from('subscriptions')
    .select(select)
    .eq('user_id', userId)

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data.map((sub) => ({
    ...sub,
    subscription_items: getArray(sub.subscription_items).map(({ prices, ...item }) => {
      const price = getSingle(prices)

      return {
        ...item,
        price: { ...price, product: getSingle(price?.products) },
      }
    }),
  }))
}

export const getOwnedProducts = async (userId: string) => {
  const result = await supabaseAdmin
    .from('product_ownership')
    .select('*, prices(*, products(*))')
    .eq('user_id', userId)

  if (result.error) {
    throw new Error(result.error.message)
  }

  return result.data.map(({ prices, ...productOwnership }) => {
    const price = getSingle(prices)
    return {
      ...productOwnership,
      price: { ...price, product: getSingle(price?.products) },
    }
  })
}

export function getPersonalTeam(
  teams: Awaited<ReturnType<typeof getUserTeams>>,
  userId: string
) {
  return getSingle(teams?.filter((team) => team.is_personal && team.owner_id === userId))
}

export function getOrgTeams(teams: Awaited<ReturnType<typeof getUserTeams>>) {
  return getArray(teams?.filter((team) => !team.is_personal) ?? [])
}

export function getMainTeam(teams: Awaited<ReturnType<typeof getUserTeams>>) {
  const sortedTeams = teams
    ?.filter((t) => t.is_active)
    .sort(
      (a, b) =>
        tiersPriority.indexOf(a.tier as any) - tiersPriority.indexOf(b.tier as any)
    )
  return sortedTeams?.[0]
}

/**
 * @deprecated
 * TODO: we only have to check if the user has a subscription to the Pro plan.
 * We can remove the check for owned products and the subscription_items.
 */
function checkAccessToProduct(
  productSlug: string,
  subscriptions: Awaited<ReturnType<typeof getSubscriptions>>,
  ownedProducts: Awaited<ReturnType<typeof getOwnedProducts>>
) {
  // Valid Pro products that grant access
  const validProProducts = [
    ProductName.TamaguiPro,
    ProductName.TamaguiProV2,
    ProductName.TamaguiProV2Upgrade,
    ProductName.TamaguiSupportDirect,
    ProductName.TamaguiSupportSponsor,
  ]

  const hasActiveSubscription = subscriptions.some(
    (subscription) =>
      (subscription.status === SubscriptionStatus.Trialing ||
        subscription.status === SubscriptionStatus.Active) &&
      (subscription.subscription_items?.some(
        (item) => getSingle(item.price.product?.metadata?.['slug']) === productSlug
      ) ||
        subscription.subscription_items?.some((item) =>
          validProProducts.some((product) => item.price.product?.name?.includes(product))
        ))
  )
  if (hasActiveSubscription) {
    return {
      access: true,
      type: 'subscription' as const,
    }
  }
  const hasLifetimeOwnership = ownedProducts.some(
    (ownedProduct) =>
      getSingle(ownedProduct.price?.product?.metadata?.['slug']) === productSlug
  )
  if (hasLifetimeOwnership) {
    return {
      access: true,
      type: 'lifetime' as const,
    }
  }
  return {
    access: false,
  }
}

/**
 * @deprecated
 * TODO: we only have to check if the user has a subscription to the Pro plan.
 * We can remove the check for owned products and the subscription_items.
 * However, for the backwards compatibility, we keep the function.
 */
/**
 * Check if user has lifetime Bento access via product_ownership
 * This is separate from Pro subscription - Bento is a lifetime purchase
 */
async function checkBentoAccess(userId: string): Promise<boolean> {
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

  // check for direct Bento product ownership
  const hasBentoOwnership = result.data.some(
    (ownership) => ownership.prices?.products?.name === ProductName.TamaguiBento
  )

  if (hasBentoOwnership) {
    return true
  }

  // check for legacy lifetime purchases with is_lifetime metadata
  const hasLifetimeBento = result.data.some((ownership) => {
    const productMetadata = ownership.prices?.metadata as Record<string, any> | null
    const productName = ownership.prices?.products?.name
    // only count as bento if it's a bento product with lifetime flag
    return (
      productMetadata?.is_lifetime === '1' && productName === ProductName.TamaguiBento
    )
  })

  return hasLifetimeBento
}

export async function getUserAccessInfo(user: User | null) {
  if (!user) {
    return {
      hasPro: false,
      hasBento: false,
      teamsWithAccess: [],
    }
  }

  const [proAccess, bentoAccess, teams] = await Promise.all([
    hasProAccess(user.id),
    checkBentoAccess(user.id),
    getUserTeams(user.id),
  ])

  const teamsWithAccess = (teams || []).filter(
    (team) =>
      team.is_active || whitelistGithubUsernames.some((name) => team.name === name)
  )
  const hasTeamAccess = teamsWithAccess.length > 0

  // user has Pro if they have subscription/legacy access OR team sponsorship access
  const hasPro = proAccess || hasTeamAccess

  // user has Bento if they have lifetime bento ownership OR pro access (pro includes bento)
  const hasBento = bentoAccess || hasPro

  return {
    hasPro,
    hasBento,
    teamsWithAccess,
  }
}

/**
 * Retrieve the theme histories that the user has previously created
 *
 * @param user - Current user object
 */
export async function getUserThemeHistories(user: User | null) {
  try {
    if (!user) return []
    // Get last few theme histories
    const { data, error } = await supabaseAdmin
      .from('theme_histories')
      .select('theme_data, search_query, created_at, id')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .limit(15)

    if (error) {
      return []
    }

    return data.map((d) => ({
      ...d,
      theme_data: ThemeSuiteSchema.parse(d.theme_data) as unknown as ThemeSuiteItemData,
    }))
  } catch {
    return []
  }
}

/**
 * Get the team eligibility for a user
 * @param user - Current user object
 */
export async function getTeamEligibility(user: User | null) {
  if (!user) {
    return {
      isProMember: false,
      subscriptions: undefined,
    }
  }

  try {
    const teamMembership = await getActiveTeamMembership(user.id)
    if (!teamMembership.isActive) {
      return {
        isProMember: false,
      }
    }

    if (!teamMembership.ownerId) {
      return {
        isProMember: true,
      }
    }

    const subscriptions = await getOwnerSubscriptions(teamMembership.ownerId)

    return {
      subscriptions,
      isProMember: true,
    }
  } catch (err) {
    return {
      subscriptions: undefined,
      isProMember: false,
    }
  }
}

/**
 * Get active team membership for a user
 */
async function getActiveTeamMembership(userId: string) {
  const { data: teamMember, error } = await supabaseAdmin
    .from('team_members')
    .select(`
      team_subscription_id,
      team_subscriptions (
        owner_id
      )
    `)
    .eq('member_id', userId)
    .eq('status', 'active')
    .single()

  if (error || !teamMember?.team_subscription_id) {
    return {
      isActive: false,
      ownerId: null,
    }
  }

  return {
    isActive: true,
    ownerId: teamMember.team_subscriptions?.owner_id,
  }
}

/**
 * Get subscriptions for a team owner
 */
async function getOwnerSubscriptions(ownerId: string) {
  const { data: subscriptions, error: subError } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      *,
      subscription_items (
        *,
        prices (
          *,
          products (*)
        ),
        app_installations (*)
      )
    `)
    .eq('user_id', ownerId)

  if (subError) {
    throw new Error(subError.message)
  }

  return subscriptions.map((sub) => ({
    ...sub,
    subscription_items: getArray(sub.subscription_items).map(({ prices, ...item }) => ({
      ...item,
      price: {
        ...getSingle(prices),
        product: getSingle(getSingle(prices)?.products),
      },
    })),
  }))
}
