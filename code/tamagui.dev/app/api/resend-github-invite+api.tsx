import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { addUserToTeam, checkIfUserIsTeamMember } from '~/features/github/helpers'
import { getUserPrivateInfo } from '~/features/user/helpers'
import { getActiveSubscriptions } from '~/features/user/helpers'
import { getArray } from '~/helpers/getArray'
import { getSingle } from '~/helpers/getSingle'

/**
 * Resend GitHub team invite for Pro users
 * This endpoint allows users to resend their GitHub team invitation
 * if they missed it or if it expired
 */
export default apiRoute(async (req) => {
  // 1. Ensure user is authenticated
  const { user } = await ensureAuth({ req })

  const body = await readBodyJSON(req)
  const subscriptionId = body['subscription_id']
  const productId = body['product_id']

  // 2. Validate input
  if (typeof subscriptionId !== 'string') {
    return Response.json(
      { error: 'subscription_id is required and must be a string' },
      { status: 400 }
    )
  }

  if (typeof productId !== 'string') {
    return Response.json(
      { error: 'product_id is required and must be a string' },
      { status: 400 }
    )
  }

  // 3. Verify user owns this subscription
  const subscription = await getActiveSubscriptions(user?.id, subscriptionId)

  if (!subscription) {
    return Response.json(
      { error: 'Subscription not found or not active' },
      { status: 404 }
    )
  }

  // 4. Verify the subscription includes the requested product
  const prices = getArray(subscription.subscription_items).map((s) => getSingle(s?.price))

  const alternativeProductId =
    productId === 'prod_RlRd2DVrG0frHe' /* Tamagui Pro */
      ? 'prod_Rxu0x7jR0nWJSv' /* Tamagui Pro Team Seats */
      : productId /* no additional product ID to check */

  let hasProduct = false
  for (const price of prices) {
    for (const product of getArray(price?.products)) {
      if (!product) continue
      if (product.id === productId || product.id === alternativeProductId) {
        hasProduct = true
        break
      }
    }
    if (hasProduct) break
  }

  if (!hasProduct) {
    return Response.json(
      { error: 'Product not found in subscription' },
      { status: 404 }
    )
  }

  // 5. Get user's GitHub username
  const userPrivate = await getUserPrivateInfo(user.id)

  if (!userPrivate.github_user_name) {
    return Response.json(
      {
        error:
          "We weren't able to find your GitHub username. Please logout, login with GitHub, and try again.",
      },
      { status: 400 }
    )
  }

  // 6. Resend the invite (addUserToTeam is idempotent - PUT method will resend)
  const teamSlug = 'early-access'

  try {
    // Check current membership status
    const memberCheck = await checkIfUserIsTeamMember(teamSlug, userPrivate.github_user_name)

    console.info(
      `Resend invite: Current status for ${userPrivate.github_user_name} - isMember: ${memberCheck.isMember}, state: ${memberCheck.state}`
    )

    // Force resend by calling addUserToTeam (PUT is idempotent and will resend invite)
    await addUserToTeam(teamSlug, userPrivate.github_user_name)

    const message =
      memberCheck.isMember && memberCheck.state === 'active'
        ? `You already have active access to the team! Visit: https://github.com/orgs/tamagui/teams/${teamSlug}`
        : memberCheck.isMember && memberCheck.state === 'pending'
          ? `Invite resent! Check your email or GitHub notifications (${userPrivate.github_user_name}) for the invitation.`
          : `Invite sent! Check your email or GitHub notifications (${userPrivate.github_user_name}) for the invitation.`

    return Response.json({
      message,
      url: `https://github.com/orgs/tamagui/teams/${teamSlug}`,
      status: memberCheck.state,
    })
  } catch (error) {
    console.error(
      `Failed to resend invite for ${userPrivate.github_user_name} to team ${teamSlug}:`,
      error
    )
    return Response.json(
      {
        error:
          'Failed to resend invite. Please contact support@tamagui.dev or get help on Discord.',
      },
      { status: 500 }
    )
  }
})
