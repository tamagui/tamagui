import type { Database, Json } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import type { User } from '@supabase/auth-helpers-nextjs'
import { inviteCollaboratorToRepo } from 'protected/_utils/github'

export class ClaimError extends Error {}

type ClaimProductArgs = {
  product: Database['public']['Tables']['products']['Row']
  user: User
} & (
  | {
      type: 'subscription'
      subscription: Database['public']['Tables']['subscriptions']['Row']
    }
  | {
      type: 'product_ownership'
      productOwnership: Database['public']['Tables']['product_ownership']['Row']
    }
)
export const claimProductAccess = async (args: ClaimProductArgs) => {
  const { product } = args

  const metadata = product.metadata
  if (typeof metadata !== 'object' || !metadata || Array.isArray(metadata)) {
    throw new Error('bad metadata')
  }

  let claimData: Awaited<ReturnType<ClaimFunction>>

  // check the product claim type and call the related claim function
  switch (metadata.claim_type) {
    case 'repo_access':
      claimData = await claimRepositoryAccess({ ...args, metadata })

      break
    default:
      throw new Error('unsupported claim_type on product metadata')
  }

  await supabaseAdmin.from('claims').insert({
    product_id: product.id,
    subscription_id: args.type === 'subscription' ? args.subscription.id : undefined,
    product_ownership_id:
      args.type === 'product_ownership' ? args.productOwnership.id : undefined,
    data: { claim_type: metadata.claim_type, ...claimData.data },
  })

  return claimData
}

type ClaimFunction = (
  args: ClaimProductArgs & {
    metadata: {
      [key: string]: Json | undefined
    }
  }
) => Promise<{
  /**
   * Will be shown to the user as feedback
   */
  message: string
  /**
   * Will be saved to DB and be used for un-claiming - be careful with changing the shape of this
   */
  data: { [key: string]: Json | undefined }
}>

const claimRepositoryAccess: ClaimFunction = async ({ user, metadata }) => {
  const permission = 'pull'

  console.info(`Claim: checking private users`)

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

  console.info(`Claim: checking github user`)

  const githubUser = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${githubToken}` },
  }).then((res) => res.json())

  const repoName = metadata.repository_name
  if (typeof repoName !== 'string')
    throw new Error('No repository_name is present on metadata')

  console.info(`Claim: inviting collaborator`)

  try {
    await inviteCollaboratorToRepo(repoName, githubUser.login, permission)

    return {
      data: {
        user_github: {
          id: githubUser.id,
          node_id: githubUser.node_id,
          login: githubUser.login,
        },
        repository_name: repoName,
        permission,
      },
      message: 'Check your email for an invitation to the repository.',
    }
  } catch (error) {
    throw new ClaimError(
      'Invitation failed. It could be that you are already invited. Check your email or GitHub notifications for the invite. Otherwise, contact support@tamagui.dev or get help on Discord.'
    )
  }
}
