import type { Database } from '~/features/supabase/types'
import { getSingle } from '~/helpers/getSingle'
import { supabaseAdmin } from '../auth/supabaseAdmin'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import {
  whitelistGithubUsernames,
  whitelistBentoUsernames,
} from '~/features/github/helpers'
import { tiersPriority } from '../stripe/tiers'
import { getArray } from '~/helpers/getArray'
import { ThemeSuiteSchema } from '../studio/theme/getTheme'
import type { ThemeSuiteItemData } from '../studio/theme/types'

export const getUserDetails = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  const result = await supabase.from('users').select('*').eq('id', userId).single()

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

export const getUserTeams = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase.from('teams').select('*')
  if (result.error) throw new Error(result.error.message)
  return result.data
}

export const getSubscriptions = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('subscriptions')
    .select('*, subscription_items(*, prices(*, products(*)), app_installations(*))')

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

export const getOwnedProducts = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('product_ownership')
    .select('*, prices(*, products(*))')

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
  const hasActiveSubscription = subscriptions.some(
    (subscription) =>
      (subscription.status === 'trialing' || subscription.status === 'active') &&
      (subscription.subscription_items.some(
        (item) => getSingle(item.price.product?.metadata?.['slug']) === productSlug
      ) ||
        subscription.subscription_items.some(
          (item) => item.price.product?.name === 'Tamagui Pro'
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
export async function getUserAccessInfo(
  supabase: SupabaseClient<Database>,
  user: User | null
) {
  const [subscriptions, ownedProducts] = await Promise.all([
    getSubscriptions(supabase),
    getOwnedProducts(supabase),
  ])

  const bentoAccessInfo = checkAccessToProduct('bento', subscriptions, ownedProducts)
  const takeoutAccessInfo = checkAccessToProduct(
    'universal-starter',
    subscriptions,
    ownedProducts
  )

  const teamsResult = await supabase.from('teams').select('id, name, is_active')
  if (teamsResult.error) {
    throw teamsResult.error
  }
  const teams = getArray(teamsResult.data)
  const teamsWithAccess = teams.filter(
    (team) =>
      team.is_active || whitelistGithubUsernames.some((name) => team.name === name)
  )
  const hasTeamAccess = teamsWithAccess.length > 0

  const isBentoWhitelisted = teams.some((team) =>
    whitelistBentoUsernames.has(team.name || '')
  )

  const hasStudioAccess =
    takeoutAccessInfo.access || // if the user has purchased takeout, we give them studio access
    hasTeamAccess // if the user is a member of at least one team (this could be a personal team too - so basically a personal sponsorship) with active sponsorship, we give them studio access

  return {
    hasBentoAccess: isBentoWhitelisted || bentoAccessInfo.access,
    hasTakeoutAccess: takeoutAccessInfo.access,
    hasStudioAccess,
    teamsWithAccess,
  }
}

/**
 * Retrieve the theme histories that the user has previously created
 *
 * @param supabase - Supabase client instance
 * @param user - Current user object
 */
export async function getUserThemeHistories(
  supabase: SupabaseClient<Database>,
  user: User | null
) {
  try {
    if (!user) return []
    // Get last few theme histories
    const { data, error } = await supabase
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
      theme_data: ThemeSuiteSchema.parse(d.theme_data) as ThemeSuiteItemData,
    }))
  } catch {
    return []
  }
}
