import { Database, Json } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { inviteCollaboratorToRepo } from '@protected/_utils/github'
import { User } from '@supabase/auth-helpers-nextjs'

export const claimProductAccess = async (
  subscription: Database['public']['Tables']['subscriptions']['Row'],
  product: Database['public']['Tables']['products']['Row'],
  user: User
) => {
  const metadata = product.metadata
  if (typeof metadata !== 'object' || !metadata || Array.isArray(metadata)) {
    throw new Error('bad metadata')
  }

  let claimData: Awaited<ReturnType<ClaimFunction>>

  // check the product claim type and call the related claim function
  switch (metadata.claim_type) {
    case 'repo_access':
      claimData = await claimRepositoryAccess({ subscription, product, user, metadata })
      break
    default:
      throw new Error('unsupported claim_type on product metadata')
  }

  await supabaseAdmin.from('claims').insert({
    product_id: product.id,
    subscription_id: subscription.id,
    data: claimData.data,
  })

  return claimData
}

type ClaimFunction = (args: {
  subscription: Database['public']['Tables']['subscriptions']['Row']
  product: Database['public']['Tables']['products']['Row']
  user: User
  metadata: {
    [key: string]: Json
  }
}) => Promise<{
  /**
   * Will be shown to the user as feedback
   */
  message: string
  /**
   * Will be saved to DB and be used for un-claiming - be careful with changing the shape of this
   */
  data: Json
}>

const claimRepositoryAccess: ClaimFunction = async ({ user, metadata }) => {
  const permission = 'triage'
  const githubTokenRes = await supabaseAdmin
    .from('github_tokens')
    .select()
    .eq('id', user.id)
    .single()

  if (githubTokenRes.error) {
    throw new Error(githubTokenRes.error.message)
  }

  const userGithubToken = githubTokenRes.data.token

  const githubUser = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${userGithubToken}` },
  }).then((res) => res.json())

  const repoName = metadata.repository_name
  if (typeof repoName !== 'string')
    throw new Error('No repository_name is present on metadata')

  await inviteCollaboratorToRepo(repoName, githubUser.login, permission)

  return {
    data: {
      user_github: {
        id: githubUser.id,
        node_id: githubUser.node_id,
        login: githubUser.login,
      },
      repo_name: repoName,
      permission,
    },
    message: 'Check your email for an invitation to the repository.',
  }
}
