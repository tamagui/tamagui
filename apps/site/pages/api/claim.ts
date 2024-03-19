import { apiRoute, postgresError } from '@lib/apiRoute'
import { ClaimError, claimProductAccess } from '@lib/claim-product'
import { protectApiRoute } from '@lib/protectApiRoute'
import { getArray, getSingle } from '@lib/supabase-utils'
import type { NextApiResponse } from 'next'

export default apiRoute(async (req, res) => {
  const { supabase, user } = await protectApiRoute({ req, res })

  console.info(`Claim: authed`)

  const subscriptionId = req.body['subscription_id']
  const productOwnershipId = Number(req.body['product_ownership_id'])

  const productId = req.body['product_id']

  const hasValidSubscriptionId = typeof subscriptionId === 'string'
  const hasValidProductOwnershipId =
    typeof productOwnershipId === 'number' && !Number.isNaN(productOwnershipId)
  if (
    (!hasValidSubscriptionId && !hasValidProductOwnershipId) ||
    (hasValidSubscriptionId && hasValidProductOwnershipId)
  ) {
    res.status(400).json({
      error: 'you should provide either `subscription_id` or `product_ownership_id`',
    })
  }

  if (typeof productId === 'undefined') {
    res.status(400).json({
      error: '`product_id` is required',
    })
  }
  if (typeof productId !== 'string') {
    res.status(400).json({
      error: 'Invalid `product_id`',
    })
    return
  }

  console.info(`Claim: validated`)
  if (subscriptionId) {
    const subscriptionRes = await supabase
      .from('subscriptions')
      .select('*, subscription_items(id, prices(*, products(*)))')
      .eq('id', subscriptionId)
      .single()

    if (subscriptionRes.error) {
      throw postgresError(subscriptionRes.error)
    }

    console.info(`Claim: found subscription`)

    const subscription = subscriptionRes.data

    const prices = getArray(subscriptionRes.data.subscription_items).map((s) =>
      getSingle(s?.prices)
    )

    console.info(`Claim: found prices`)

    for (const price of prices) {
      for (const product of getArray(price?.products)) {
        if (!product) continue
        if (product.id === productId) {
          try {
            console.info(`Claim: claiming ${product.id}`)
            console.info(`Claim: claim data: ${JSON.stringify(product)}`)

            const claimData = await claimProductAccess({
              type: 'subscription',
              product,
              user,
              subscription,
            })

            console.info(`Claim: claimed access for product ${product.id}`)
            handleClaimResponse(res, claimData)
          } catch (error) {
            if (error instanceof ClaimError) {
              res.json({
                message: error.message,
              })
            } else {
              console.error(`Claim: claim failed. error message: ${error.message}`)
              res.status(500).json({})
            }
          }
          return
        }
      }
    }
  } else {
    const productOwnershipRes = await supabase
      .from('product_ownership')
      .select('*, prices(*, products(*))')
      .eq('id', productOwnershipId)
      .single()

    if (productOwnershipRes.error) {
      throw postgresError(productOwnershipRes.error)
    }

    console.info(`Claim: found product ownership`)

    const productOwnership = productOwnershipRes.data

    const price = getSingle(productOwnershipRes.data.prices)

    console.info(`Claim: found prices`)

    for (const product of getArray(price?.products)) {
      if (!product) continue
      if (product.id === productId) {
        try {
          console.info(`Claim: claiming ${product.id}`)
          console.info(`Claim: claim data: ${JSON.stringify(product)}`)

          const claimData = await claimProductAccess({
            type: 'product_ownership',
            product,
            user,
            productOwnership,
          })

          console.info(`Claim: claimed access for product ${product.id}`)

          handleClaimResponse(res, claimData)
        } catch (error) {
          if (error instanceof ClaimError) {
            res.json({
              message: error.message,
            })
          } else {
            console.error(`Claim: claim failed. error message: ${error.message}`)
            res.status(500).json({})
          }
        }
        return
      }
    }
  }

  res.status(404).json({ error: 'no product matched' })
})

function handleClaimResponse(
  res: NextApiResponse,
  claimData: Awaited<ReturnType<typeof claimProductAccess>>
) {
  if (claimData.url) {
    res.json({
      url: claimData.url,
    })
  } else if (claimData.message) {
    res.json({
      message: claimData.message,
    })
  } else {
    throw new Error('Nothing to send to the user.')
  }
}
