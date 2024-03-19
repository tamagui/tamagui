import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import { getArray, getSingle } from '@lib/supabase-utils'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import type { Session } from '@supabase/auth-helpers-nextjs'
import { checkForSponsorship } from 'protected/_utils/github'
import { siteRootDir } from 'protected/constants'

// const usernameWhitelist = ['natew', 'alitnk']

async function githubTokenSync(session: Session) {
  const token = session?.provider_token ?? session?.user?.user_metadata.github_token
  if (token) {
    await supabaseAdmin
      .from('users_private')
      .upsert({ id: session.user.id, github_token: token })
  }

  return token
}

export default apiRoute(async (req, res) => {
  const { session, user } = await protectApiRoute({ req, res })

  const [userGithubToken] = await Promise.all([githubTokenSync(session)])

  const githubLogin =
    session.user?.user_metadata.user_name ??
    session.user?.identities?.find((identity) => identity.provider === 'github')
      ?.identity_data?.user_name
  if (
    !session.user.app_metadata.providers.includes('github') ||
    !githubLogin ||
    !userGithubToken
  ) {
    console.error(
      `Failed to get github data for ${user.email}. session: `,
      JSON.stringify(session)
    )
    res.status(403).json({
      error: 'No GitHub connection found. Connect or sync GitHub account and try again.',
      action: `${siteRootDir}/account`,
    })
    return
  }
  const githubStatus = await checkForSponsorship(githubLogin, userGithubToken)

  const userRaw = await supabaseAdmin
    .from('users')
    .select('id, memberships(teams(*))')
    .eq('id', user.id)
    .single()

  if (userRaw.error) {
    throw new Error(userRaw.error.message)
  }

  const userTeams = getArray(userRaw.data?.memberships).map((team) =>
    getSingle(team?.teams)
  )

  const userPersonalTeam = userTeams?.find((team) => team?.is_personal)

  if (!userPersonalTeam) {
    const personalTeamResults = await supabaseAdmin
      .from('teams')
      .upsert(
        {
          github_id: githubStatus.personal.meta.id,
          name: githubLogin,
          is_personal: true,
          owner_id: user.id,
          tier:
            githubStatus.personal.sponsorshipStatus === 'sponsor'
              ? githubStatus.personal.tier.id
              : null,
          is_active: githubStatus.personal.hasSponsorAccess,
        },
        {}
      )
      .select('id')
      .single()

    if (personalTeamResults.error) {
      throw new Error(personalTeamResults.error.message)
    }
    await supabaseAdmin.from('memberships').upsert({
      team_id: personalTeamResults.data.id,
      user_id: user.id,
    })
  } else {
    const personalTeamResults = await supabaseAdmin
      .from('teams')
      .update(
        {
          github_id: githubStatus.personal.meta.id,
          name: githubLogin,
          is_personal: true,
          tier:
            githubStatus.personal.sponsorshipStatus === 'sponsor'
              ? githubStatus.personal.tier.id
              : null,
          is_active: githubStatus.personal.hasSponsorAccess,
        },
        {}
      )
      .eq('id', userPersonalTeam.id)
      .select('id')
      .single()

    if (personalTeamResults.error) {
      throw new Error(personalTeamResults.error.message)
    }
  }

  // these are the teams user should be a part of but might or might not be at the moment
  const teamsToAdd = await supabaseAdmin
    .from('teams')
    .select('id, github_id')
    .in(
      'github_id',
      githubStatus.orgs
        .filter((r) => r.hasSponsorAccess === true)
        .map((r) => {
          // no need for the if but ts is stupid
          if (r.hasSponsorAccess) return r.meta.id
        })
    )

  if (teamsToAdd.error) {
    throw new Error(teamsToAdd.error.message)
  }

  for (const org of githubStatus.orgs) {
    if (!org.hasSponsorAccess) continue
    const dbOrg = teamsToAdd.data.find((row) => row?.github_id === org.meta.id)

    if (!dbOrg) {
      // if this user is the first member from the org to sync, create the org first
      const newTeam = await supabaseAdmin
        .from('teams')
        .upsert({
          is_active: true,
          is_personal: false,
          name: org.meta.name,
          github_id: org.meta.id,
          tier: org.sponsorshipStatus === 'sponsor' ? org.tier.id : undefined,
        })
        .select('id')
        .single()
      if (newTeam.error) {
        throw new Error(newTeam.error.message)
      }
      const teamId = newTeam.data.id
      await supabaseAdmin.from('memberships').upsert({
        team_id: teamId,
        user_id: user.id,
      })
    } else {
      // the org is already created, if the user is not a part of it, add the user
      for (const toAdd of userTeams.filter(
        (team) =>
          !!team?.github_id &&
          !team.is_personal &&
          !teamsToAdd.data.some((dbTeam) => dbTeam.github_id === team.github_id)
      )) {
        if (!toAdd) continue
        await supabaseAdmin.from('memberships').upsert({
          team_id: toAdd?.id,
          user_id: user.id,
        })
      }

      // if (toAdd.find(team => org.meta.id ))
    }
  }

  // if (githubStatus.orgs.)

  //   const isWhitelisted = usernameWhitelist.includes(githubLogin)
  //   const isSponsor =
  //     !!personalSponsorship?.sponsoring || orgs.some((org) => org.sponsorship.sponsoring)
  //   const accessStudio: UserAccessStatus['access']['studio'] =
  //     orgs.find((org) => org.sponsorship.sponsoring)?.sponsorship.studio ??
  //     personalSponsorship.studio

  //   if (personalSponsorship.sponsoring) {
  //     const what = supabaseAdmin.from('organizations')
  //   }
  //   res.json({
  //     access: {
  //       sponsoring: isSponsor,
  //       studio: accessStudio,
  //     },
  //     isWhitelisted,
  //     githubStatus: { orgs, personalSponsorship },
  //   } satisfies UserAccessStatus)

  res.json({ done: true })
})
