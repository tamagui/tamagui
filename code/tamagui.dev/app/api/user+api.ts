import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import type { UserContextType } from '~/features/auth/types'
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

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })

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
