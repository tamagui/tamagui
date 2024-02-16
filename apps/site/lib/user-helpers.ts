import type { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import type { SupabaseClient } from '@supabase/supabase-js'
import { whitelistGithubUsernames } from 'protected/_utils/github'
import { tiersPriority } from 'protected/constants'

export const getUserDetails = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase.from('users').select('*').single()
  if (result.error) throw new Error(result.error.message)
  return result.data
}

export const getUserPrivateInfo = async (userId: string) => {
  const result = await supabaseAdmin
    .from('users_private')
    .upsert({ id: userId })
    .select('*')
    .single()

  if (result.error) throw new Error(result.error.message)
  return result.data
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
  if (result.error) throw new Error(result.error.message)
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
  if (result.error) throw new Error(result.error.message)
  return result.data.map(({ prices, ...productOwnership }) => {
    const price = getSingle(prices)
    return {
      ...productOwnership,
      price: { ...price, product: getSingle(price?.products) },
    }
  })
}

export const getProductOwnerships = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('product_ownership')
    .select('*, prices(*, products(*))')
  if (result.error) throw new Error(result.error.message)
  return result.data.map(({ prices, ...sub }) => {
    const price = getSingle(prices)
    return {
      ...sub,
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

function checkAccessToProduct(
  productSlug: string,
  subscriptions: Awaited<ReturnType<typeof getSubscriptions>>,
  ownedProducts: Awaited<ReturnType<typeof getOwnedProducts>>
) {
  const hasActiveSubscription = subscriptions.some(
    (subscription) =>
      (subscription.status === 'trialing' || subscription.status === 'active') &&
      subscription.subscription_items.some(
        (item) => getSingle(item.price.product?.metadata?.['slug']) === productSlug
      )
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

async function checkTeamAccess(supabase: SupabaseClient<Database>) {
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
  return {
    access: hasTeamAccess,
    teamsWithAccess,
    teams,
  }
}

export async function getUserAccessInfo(supabase: SupabaseClient<Database>) {
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

  const { access: teamAccess, teamsWithAccess } = await checkTeamAccess(supabase)

  const hasStudioAccess =
    takeoutAccessInfo.access || // if the user has purchased takeout, we give them studio access
    teamAccess // if the user is a member of at least one team (this could be a personal team too - so basically a personal sponsorship) with active sponsorship, we give them studio access

  return {
    hasBentoAccess: bentoAccessInfo.access,
    hasTakeoutAccess: takeoutAccessInfo.access,
    hasStudioAccess,
    teamsWithAccess,
  }
}
