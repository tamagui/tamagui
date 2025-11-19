import type { User } from '@supabase/supabase-js'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { addUserToTeam, checkIfUserIsTeamMember } from '~/features/github/helpers'
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
    claim_type: 'team_access',
    team_slug: 'early-access',
  }

  const claimData = await claimTeamAccess({ ...args, metadata })

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

const claimTeamAccess: ClaimFunction = async ({ user, metadata, request }) => {
  console.info(`Claim: checking private users`)

  const teamSlug = metadata.team_slug
  if (typeof teamSlug !== 'string') throw new Error('No team_slug is present on metadata')

  console.info(`Claim: adding user to team ${teamSlug}`)

  const userPrivate = await getUserPrivateInfo(user.id)

  console.info(`Claim: got github username`, userPrivate.github_user_name)

  if (!userPrivate.github_user_name) {
    throw new ClaimError(
      "We weren't able to find your GitHub username. Please logout of your account, login and try again. If this kept occurring, contact support@tamagui.dev or get help on Discord."
    )
  }

  try {
    const memberCheck = await checkIfUserIsTeamMember(
      teamSlug,
      userPrivate.github_user_name
    )

    if (memberCheck.isMember) {
      console.info(`User is already a team member (state: ${memberCheck.state})`)
      return {
        data: {
          user_github: {
            id: userPrivate.id,
            login: userPrivate.github_user_name,
          },
          team_slug: teamSlug,
          role: memberCheck.role || 'member',
        },
        message: `You already have access! You can view Takeout v1 at https://github.com/tamagui/takeout and Takeout v2 at https://github.com/tamagui/takeout3`,
        url: `https://github.com/tamagui/takeout`,
      }
    }

    await addUserToTeam(teamSlug, userPrivate.github_user_name)

    console.info(`Added to team successfully`)

    return {
      data: {
        user_github: {
          id: userPrivate.id,
          login: userPrivate.github_user_name,
        },
        team_slug: teamSlug,
        role: 'member',
      },
      message: `Successfully added to team! Check your email or GitHub notifications (${userPrivate.github_user_name}) for an invitation. You'll have access to Takeout v1 at https://github.com/tamagui/takeout and Takeout v2 at https://github.com/tamagui/takeout3`,
      url: `https://github.com/tamagui/takeout`,
    }
  } catch (error) {
    console.error(
      `Failed to add ${userPrivate.github_user_name} to team ${teamSlug}, error: ${error}`,
      error
    )
    throw new ClaimError(
      'Adding to team failed. It could be that you are already invited. Check your email or GitHub notifications for the invite. Otherwise, contact support@tamagui.dev or get help on Discord.'
    )
  }
}
