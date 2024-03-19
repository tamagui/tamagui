import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import type { Database } from '@lib/supabase-types'
import {
  getMainTeam,
  getOrgTeams,
  getPersonalTeam,
  getProductOwnerships,
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
  getUserPrivateInfo,
  getUserTeams,
} from '@lib/user-helpers'
import type { Session, User } from '@supabase/supabase-js'

export type UserContextType = {
  subscriptions?: Awaited<ReturnType<typeof getSubscriptions>> | null
  productOwnerships?: Awaited<ReturnType<typeof getProductOwnerships>> | null
  session: Session
  user: User
  userDetails?: Awaited<ReturnType<typeof getUserDetails>> | null
  teams: {
    all?: Database['public']['Tables']['teams']['Row'][] | null
    orgs?: Database['public']['Tables']['teams']['Row'][] | null
    personal?: Database['public']['Tables']['teams']['Row'] | null
    main?: Database['public']['Tables']['teams']['Row'] | null
  }
  connections: {
    github: boolean
    discord: boolean
  }
  accessInfo: Awaited<ReturnType<typeof getUserAccessInfo>>
}

export default apiRoute(async (req, res) => {
  const { supabase, session } = await protectApiRoute({ req, res })

  const userRes = await supabase.auth.getUser()

  const user = userRes.data.user
  if (!user || !session) {
    res.status(401).json({
      error: 'The user is not authenticated',
    })
    return
  }

  const [
    userTeams,
    userDetails,
    subscriptions,
    productOwnerships,
    privateInfo,
    accessInfo,
  ] = await Promise.all([
    getUserTeams(supabase),
    getUserDetails(supabase),
    getSubscriptions(supabase),
    getProductOwnerships(supabase),
    getUserPrivateInfo(user.id),
    getUserAccessInfo(supabase),
  ])

  res.json({
    session,
    user,
    userDetails,
    subscriptions,
    productOwnerships,
    teams: {
      all: userTeams,
      personal: getPersonalTeam(userTeams, user.id),
      orgs: getOrgTeams(userTeams),
      main: getMainTeam(userTeams),
    },
    connections: {
      discord: !!privateInfo.discord_token,
      github: !!privateInfo.github_token,
    },
    accessInfo,
  } satisfies UserContextType)
})
