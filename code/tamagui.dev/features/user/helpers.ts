import type { User } from '@supabase/supabase-js'
import { getArray } from '~/helpers/getArray'
import { getSingle } from '~/helpers/getSingle'
import { ProductName, ProductSlug, SubscriptionStatus } from '~/shared/types/subscription'
import { supabaseAdmin } from '../auth/supabaseAdmin'
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
  return subscriptions.find(
    (s) =>
      s.id &&
      s.id === subscriptionId &&
      (s.status === SubscriptionStatus.Active || s.status === SubscriptionStatus.Trialing)
  )
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
