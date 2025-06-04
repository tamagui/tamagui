import type { User } from '@supabase/supabase-js'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import {
  inviteCollaboratorToRepo,
  checkIfUserIsCollaborator,
} from '~/features/github/helpers'
import type { Database, Json } from '~/features/supabase/types'
import { ProductName } from '~/shared/types/subscription'
import { getUserPrivateInfo } from './helpers'

export class ClaimError extends Error {}

type ClaimProductArgs = {
  request: Request
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

export const claimTakeoutForProPlan = async (args: ClaimProductArgs) => {
  const { product } = args

  if (!product.name?.includes(ProductName.TamaguiPro)) {
    throw new Error('Product is not Tamagui Pro')
  }

  const metadata = {
    claim_type: 'repo_access',
    repository_name: 'takeout',
  }

  const claimData = await claimRepositoryAccess({ ...args, metadata })

  if (claimData.data) {
    await supabaseAdmin.from('claims').insert({
      product_id: product.id,
      subscription_id: args.type === 'subscription' ? args.subscription.id : null,
      product_ownership_id:
        args.type === 'product_ownership' ? args.productOwnership.id : null,
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

const claimRepositoryAccess: ClaimFunction = async ({ user, metadata, request }) => {
  console.info(`Claim: checking private users`)

  const repoName = metadata.repository_name
  if (typeof repoName !== 'string')
    throw new Error('No repository_name is present on metadata')

  console.info(`Claim: inviting collaborator`)

  const permission = 'pull'

  const userPrivate = await getUserPrivateInfo(user.id)

  console.info(`Claim: got github username`, userPrivate.github_user_name)

  if (!userPrivate.github_user_name) {
    throw new ClaimError(
      "We weren't able to find your GitHub username. Please logout of your account, login and try again. If this kept occurring, contact support@tamagui.dev or get help on Discord."
    )
  }

  try {
    const collaboratorCheck = await checkIfUserIsCollaborator(
      repoName,
      userPrivate.github_user_name
    )

    if (collaboratorCheck.isCollaborator) {
      console.info(`User is already a collaborator`)
      return {
        data: {
          user_github: {
            id: userPrivate.id,
            login: userPrivate.github_user_name,
          },
          repository_name: repoName,
          permission,
        },
        message: `You are already a collaborator on the repository. You can access it directly at: ${collaboratorCheck.repoUrl}`,
        ...(collaboratorCheck.repoUrl && { url: collaboratorCheck.repoUrl }),
      }
    }

    await inviteCollaboratorToRepo(repoName, userPrivate.github_user_name, permission)

    console.info(`Invited successfully`)

    return {
      data: {
        user_github: {
          id: userPrivate.id,
          login: userPrivate.github_user_name,
        },
        repository_name: repoName,
        permission,
      },
      message: `Successfully invited. Check your email or GitHub notifications (${userPrivate.github_user_name}) for an invitation to the repository.`,
    }
  } catch (error) {
    console.error(
      `Failed to invite ${userPrivate.github_user_name} with ${permission} permission, error: ${error}`,
      error
    )
    throw new ClaimError(
      'Invitation failed. It could be that you are already invited. Check your email or GitHub notifications for the invite. Otherwise, contact support@tamagui.dev or get help on Discord.'
    )
  }
}
