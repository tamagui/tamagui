import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import type { UserContextType } from '~/features/auth/types'
import {
  getMainTeam,
  getOrgTeams,
  getPersonalTeam,
  getSubscriptions,
  getUserAccessInfo,
  getUserDetails,
  getUserTeams,
  getUserThemeHistories,
  getTeamEligibility,
} from '~/features/user/helpers'

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> bb1ec591ea (checkout from pro-team-plan branch)
  const [
    userTeams,
    userDetails,
    subscriptions,
    accessInfo,
    themeHistories,
    teamEligibility,
  ] = await Promise.all([
    getUserTeams(supabase),
    getUserDetails(supabase, user.id),
    getSubscriptions(supabase),
    getUserAccessInfo(supabase, user),
    getUserThemeHistories(supabase, user),
    getTeamEligibility(supabase, user),
  ])
<<<<<<< HEAD
=======
  const [userTeams, userDetails, subscriptions, accessInfo, themeHistories] =
    await Promise.all([
      getUserTeams(supabase),
      getUserDetails(supabase, user.id),
      getSubscriptions(supabase),
      getUserAccessInfo(supabase, user),
      getUserThemeHistories(supabase, user),
    ])
>>>>>>> c9c636fbac (fix login)
=======
>>>>>>> bb1ec591ea (checkout from pro-team-plan branch)

  return Response.json({
    user,
    userDetails,
    subscriptions,
    teams: {
      all: userTeams,
      personal: getPersonalTeam(userTeams, user.id),
      orgs: getOrgTeams(userTeams),
      main: getMainTeam(userTeams),
    },
    accessInfo,
    themeHistories,
    teamEligibility,
  } satisfies UserContextType)
})
