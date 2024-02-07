import type { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import type { SupabaseClient } from '@supabase/supabase-js'
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

export async function getProductAccessInfo(supabase: SupabaseClient<Database>) {
  const [subscriptions, ownedProducts] = await Promise.all([
    getSubscriptions(supabase),
    getOwnedProducts(supabase),
  ])

  return {
    bento: checkAccessToProduct('bento', subscriptions, ownedProducts),
    takeout: checkAccessToProduct('takeout', subscriptions, ownedProducts),
  }
}
