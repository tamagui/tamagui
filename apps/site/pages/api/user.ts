import { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { NextApiHandler } from 'next'
import { tiersPriority } from 'protected/constants'

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  session: Session
  user: User
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
  teams: {
    all?: Database['public']['Tables']['teams']['Row'][] | null
    orgs?: Database['public']['Tables']['teams']['Row'][] | null
    personal?: Database['public']['Tables']['teams']['Row'] | null
    main?: Database['public']['Tables']['teams']['Row'] | null
  }
}

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const [
    {
      data: { session },
    },
    userRes,
  ] = await Promise.all([supabase.auth.getSession(), supabase.auth.getUser()])

  const user = userRes.data.user
  if (!user || !session) {
    res.status(401).json({
      error: 'The user is not authenticated',
    })
    return
  }

  const [userTeams, userDetails, subscriptions] = await Promise.all([
    getUserTeams(supabase),
    getUserDetails(supabase),
    getSubscriptions(supabase),
  ])

  res.json({
    session,
    user,
    userDetails,
    subscriptions,
    teams: {
      all: userTeams,
      personal: getPersonalTeam(userTeams, user.id),
      orgs: getOrgTeams(userTeams),
      main: getMainTeam(userTeams),
    },
  } satisfies UserContextType)
}

export default handler

const getUserDetails = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase.from('users').select('*').single()
  if (result.error) throw new Error(result.error.message)
  return result.data
}

const getUserTeams = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase.from('teams').select('*')
  if (result.error) throw new Error(result.error.message)
  return result.data
}

const getSubscriptions = async (supabase: SupabaseClient<Database>) => {
  const result = await supabase
    .from('subscriptions')
    .select('*, subscription_items(*, prices(*, products(*)))')
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

function getPersonalTeam(
  teams: Awaited<ReturnType<typeof getUserTeams>>,
  userId: string
) {
  return getSingle(teams?.filter((team) => team.is_personal && team.owner_id === userId))
}

function getOrgTeams(teams: Awaited<ReturnType<typeof getUserTeams>>) {
  return getArray(teams?.filter((team) => !team.is_personal) ?? [])
}

function getMainTeam(teams: Awaited<ReturnType<typeof getUserTeams>>) {
  const sortedTeams = teams?.sort(
    (a, b) => tiersPriority.indexOf(a.tier as any) - tiersPriority.indexOf(b.tier as any)
  )
  return sortedTeams?.[0]
}
