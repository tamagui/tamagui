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
  if (!metadata.claim_type) {
    throw new Error(`no claim_type present on the product metadata`)
  }
  switch (metadata.claim_type) {
    case 'repo_access':
      claimData = await claimRepositoryAccess({ ...args, metadata })
      break
    case 'supabase_storage_download':
      claimData = await getDownloadFromSupabaeStorage({ ...args, metadata })
      break
    case 'send_to_link':
      claimData = await sendUserToLink({ ...args, metadata })
      break
    default:
      throw new Error(`unsupported claim_type ${metadata.claim_type} on product metadata`)
  }

  if (claimData.data) {
    await supabaseAdmin.from('claims').insert({
      product_id: product.id,
      subscription_id: args.type === 'subscription' ? args.subscription.id : undefined,
      product_ownership_id:
        args.type === 'product_ownership' ? args.productOwnership.id : undefined,
      data: { claim_type: metadata.claim_type, ...claimData.data },
    })
  }

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
  message?: string
  /**
   * Send the user to this url
   * This could be used for redirecting the user to a page, or to download a file
   * Note: the redirection is handled on the frontend
   */
  url?: string
  /**
   * Will be saved to DB and be used for un-claiming - be careful with changing the shape of this
   * If null, no record will be saved to the DB
   */
  data: { [key: string]: Json | undefined } | null
}>

const claimRepositoryAccess: ClaimFunction = async ({ user, metadata }) => {
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

  const permission = 'pull'

  if (!githubUser.login) {
    throw new ClaimError(
      "We weren't able to find your GitHub username. Please logout of your account, login and try again. If this kept occurring, contact support@tamagui.dev or get help on Discord."
    )
  }
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
    console.error(
      `Failed to invite ${githubUser.login} with ${permission} permission, error: ${error.message}`,
      error
    )
    throw new ClaimError(
      'Invitation failed. It could be that you are already invited. Check your email or GitHub notifications for the invite. Otherwise, contact support@tamagui.dev or get help on Discord.'
    )
  }
}

const getDownloadFromSupabaeStorage: ClaimFunction = async ({ user, metadata }) => {
  if (typeof metadata.supabase_storage_bucket !== 'string') {
    throw new Error('No supabase_storage_bucket is associated to the product metadata.')
  }
  if (typeof metadata.supabase_storage_path !== 'string') {
    throw new Error('No supabase_storage_path is associated to the product metadata.')
  }
  try {
    const { data, error } = await supabaseAdmin.storage
      .from(metadata.supabase_storage_bucket)
      .createSignedUrl(metadata.supabase_storage_path, 60 * 60, {})
    if (error) {
      throw new Error(error.message)
    }
    return {
      data: {
        signed_url: data.signedUrl,
        download_requested_at: new Date().toISOString(),
      },
      url: data.signedUrl,
    }
  } catch (error) {
    console.error(
      `Failed to get a signed url for bucket: "${metadata.supabase_storage_bucket}" and path: "${metadata.supabase_storage_path}", error: ${error.message}`,
      error
    )
    throw new ClaimError(
      'Failed to download. Please contact support@tamagui.dev or get help on Discord.'
    )
  }
}

const sendUserToLink: ClaimFunction = async ({ user, metadata }) => {
  if (typeof metadata.usage_link !== 'string') {
    console.error('No metadata.usage_link present')
    throw new ClaimError(
      'Failed to redirect you. Please contact support@tamagui.dev or get help on Discord.'
    )
  }
  return {
    data: null,
    url: metadata.usage_link,
  }
}
