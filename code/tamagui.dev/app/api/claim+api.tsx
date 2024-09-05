import { apiRoute, postgresError } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { ClaimError, claimProductAccess } from '~/features/user/claim-product'
import { getArray } from '~/helpers/getArray'
import { getSingle } from '~/helpers/getSingle'

export default apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req })

  const body = await readBodyJSON(req)
  const subscriptionId = body['subscription_id']
  const productOwnershipId = Number(body['product_ownership_id'])
  const productId = body['product_id']

  const hasValidSubscriptionId = typeof subscriptionId === 'string'
  const hasValidProductOwnershipId =
    typeof productOwnershipId === 'number' && !Number.isNaN(productOwnershipId)

  if (
    (!hasValidSubscriptionId && !hasValidProductOwnershipId) ||
    (hasValidSubscriptionId && hasValidProductOwnershipId)
  ) {
    return Response.json(
      {
        error: 'you should provide either `subscription_id` or `product_ownership_id`',
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

  console.info('Claim: validated')

  if (subscriptionId) {
    const subscriptionRes = await supabase
      .from('subscriptions')
      .select('*, subscription_items(id, prices(*, products(*)))')
      .eq('id', subscriptionId)
      .single()

    if (subscriptionRes.error) {
      throw postgresError(subscriptionRes.error)
    }

    console.info('Claim: found subscription')
    const subscription = subscriptionRes.data
    const prices = getArray(subscriptionRes.data.subscription_items).map((s) =>
      getSingle(s?.prices)
    )

    console.info('Claim: found prices')

    for (const price of prices) {
      for (const product of getArray(price?.products)) {
        if (!product) continue
        if (product.id === productId) {
          try {
            console.info(`Claim: claiming ${product.id}`)
            console.info(`Claim: claim data: ${JSON.stringify(product)}`)

            const claimData = await claimProductAccess({
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

    console.info('Claim: found product ownership')
    const productOwnership = productOwnershipRes.data
    const price = getSingle(productOwnershipRes.data.prices)

    console.info('Claim: found prices')

    for (const product of getArray(price?.products)) {
      if (!product) continue
      if (product.id === productId) {
        try {
          console.info(`Claim: claiming ${product.id}`)
          console.info(`Claim: claim data: ${JSON.stringify(product)}`)

          const claimData = await claimProductAccess({
            request: req,
            type: 'product_ownership',
            product,
            user,
            productOwnership,
          })

          console.info(`Claim: claimed access for product ${product.id}`)
          return handleClaimResponse(claimData)
        } catch (error) {
          if (error instanceof ClaimError) {
            return Response.json({ message: error.message }, { status: 400 })
          }
          console.error(`Claim: claim failed. error message: ${error}`)
          return Response.json({}, { status: 500 })
        }
      }
    }
  }

  return Response.json({ error: 'no product matched' }, { status: 404 })
})

function handleClaimResponse(claimData: Awaited<ReturnType<typeof claimProductAccess>>) {
  if (claimData.url) {
    return Response.json({ url: claimData.url })
  }
  if (claimData.message) {
    return Response.json({ message: claimData.message })
  }
  throw new Error('Nothing to send to the user.')
}
