import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import { Database } from '@lib/supabase-types'
import {
  getMainTeam,
  getOrgTeams,
  getPersonalTeam,
  getSubscriptions,
  getUserDetails,
  getUserPrivateInfo,
  getUserTeams,
} from '@lib/user-helpers'
import { Session, User } from '@supabase/supabase-js'

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
  connections: {
    github: boolean
    discord: boolean
  }
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

  const [userTeams, userDetails, subscriptions, privateInfo] = await Promise.all([
    getUserTeams(supabase),
    getUserDetails(supabase),
    getSubscriptions(supabase),
    getUserPrivateInfo(user.id),
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
    connections: {
      discord: !!privateInfo.discord_token,
      github: !!privateInfo.github_token,
    },
  } satisfies UserContextType)
})
