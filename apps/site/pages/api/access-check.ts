import { checkForSponsorship } from '@protected/_utils/github'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'
import { UserAccessStatus } from 'types'

const usernameWhitelist = ['natew', 'alitnk']

export const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session)
    return res.status(401).json({
      error: 'The user does not have an active session or is not authenticated',
      action: '/login',
    })

  const githubLogin =
    session.user.app_metadata.provider === 'github'
      ? session.user.user_metadata.user_name
      : session.user?.identities?.find((identity) => identity.provider === 'github')
          ?.identity_data?.user_name

  if (!githubLogin) {
    res.status(403).json({
      error: 'No GitHub connection found.',
      action: '/account',
    })
  }
  const { isSponsoring, tierIncludesStudio } = await checkForSponsorship(githubLogin)
  const isWhitelisted = usernameWhitelist.includes(githubLogin)

  res.json({
    access: {
      studio: tierIncludesStudio,
    },
    isSponsor: isSponsoring,
    isWhitelisted,
  } satisfies UserAccessStatus)
}

export default handler
