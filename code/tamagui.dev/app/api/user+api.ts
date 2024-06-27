import type { Session, User } from '@supabase/supabase-js'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import type { Database } from '~/features/supabase/types'
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
} from '~/features/user/helpers'

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

export default apiRoute(async (req) => {
  const { supabase, user, session } = await ensureAuth({ req })

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
    getUserAccessInfo(supabase, user),
  ])

  return Response.json({
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
