import { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { SupabaseClient } from '@supabase/supabase-js'
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
    subscription_items: getArray(sub.subscription_items).map((item) => {
      const price = getSingle(item?.prices)
      return {
        ...item,
        price: { ...price, product: getSingle(price?.products) },
      }
    }),
  }))
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

export async function userHasTakeout(supabase: SupabaseClient<Database>) {
  const subscriptions = await getSubscriptions(supabase)
  for (const sub of subscriptions) {
    for (const subItem of sub.subscription_items) {
      const productId = subItem.price.product?.id || subItem.price.product_id
      if (productId && isProductTakeout(productId)) {
        return true
      }
    }
  }
  return false
}

function isProductTakeout(productId: string) {
  return productId === 'prod_NzLEazaqBgoKnC' // takeout's stripe product id
}
