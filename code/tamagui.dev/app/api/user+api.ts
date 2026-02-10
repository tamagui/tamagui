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
  getUserPrivateInfo,
  getUserTeams,
  getUserThemeHistories,
} from '~/features/user/helpers'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  const [userTeams, userDetails, subscriptions, accessInfo, themeHistories, userPrivate] =
    await Promise.all([
      getUserTeams(user.id),
      getUserDetails(user.id),
      getSubscriptions(user?.id),
      getUserAccessInfo(user),
      getUserThemeHistories(user),
      getUserPrivateInfo(user.id),
    ])

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
    githubUsername: userPrivate?.github_user_name ?? null,
  } satisfies UserContextType)
})
