import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { ClaimError, claimTakeoutForProPlan } from '~/features/user/claim-product'
import { getActiveSubscriptions } from '~/features/user/helpers'
import { getArray } from '~/helpers/getArray'
import { getSingle } from '~/helpers/getSingle'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  const body = await readBodyJSON(req)
  const subscriptionId = body['subscription_id']
  const productId = body['product_id']

  const hasValidSubscriptionId = typeof subscriptionId === 'string'

  if (!hasValidSubscriptionId) {
    return Response.json(
      {
        error: 'you should provide either `subscription_id`',
      },
      {
        status: 400,
      }
    )
  }

  if (typeof productId === 'undefined') {
    return Response.json(
      {
        error: '`product_id` is required',
      },
      {
        status: 400,
      }
    )
  }

  if (typeof productId !== 'string') {
    return Response.json(
      {
        error: 'Invalid `product_id`',
      },
      {
        status: 400,
      }
    )
  }

  const subscription = await getActiveSubscriptions(user?.id, subscriptionId)

  if (!subscription) {
    return Response.json({ error: 'Subscription not found' }, { status: 404 })
  }

  const prices = getArray(subscription.subscription_items).map((s) => getSingle(s?.price))

  for (const price of prices) {
    for (const product of getArray(price?.products)) {
      if (!product) continue
      if (product.id !== productId) continue

      try {
        console.info(`Claim: claiming ${product.id}`)
        console.info(`Claim: claim data: ${JSON.stringify(product)}`)

        const claimData = await claimTakeoutForProPlan({
          request: req,
          type: 'subscription',
          product,
          user,
          subscription,
        })

        console.info(`Claim: claimed access for product ${product.id}`)
        return handleClaimResponse(claimData)
      } catch (error) {
        if (error instanceof ClaimError) {
          console.error(`Error processing claim`, error.message)
          return Response.json({ message: error.message }, { status: 400 })
        }
        console.error(`Claim: claim failed. error message: ${error}`)
        return Response.json({}, { status: 500 })
      }
    }
  }

  return Response.json({ error: 'no product matched' }, { status: 404 })
})

function handleClaimResponse(
  claimData: Awaited<ReturnType<typeof claimTakeoutForProPlan>>
) {
  if (claimData.url) {
    return Response.json({ url: claimData.url })
  }
  if (claimData.message) {
    return Response.json({ message: claimData.message })
  }
  throw new Error('Nothing to send to the user.')
}
