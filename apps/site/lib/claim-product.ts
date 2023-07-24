import { Database, Json } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { User } from '@supabase/auth-helpers-nextjs'
import { inviteCollaboratorToRepo } from 'protected/_utils/github'

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
      // @ts-ignore
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
    [key: string]: Json | undefined
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
  const userPrivateRes = await supabaseAdmin
    .from('users_private')
    .select()
    .eq('id', user.id)
    .single()

  if (userPrivateRes.error) {
    if (userPrivateRes.error.message.includes('rows returned')) {
      throw new Error(
        'No GitHub connection found. Try logging out and logging in with GitHub again.'
      )
    }
    throw userPrivateRes.error
  }

  const githubToken = userPrivateRes.data.github_token

  const githubUser = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${githubToken}` },
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
