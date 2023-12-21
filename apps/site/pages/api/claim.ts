import { apiRoute, postgresError } from '@lib/apiRoute'
import { ClaimError, claimProductAccess } from '@lib/claim-product'
import { protectApiRoute } from '@lib/protectApiRoute'
import { getArray, getSingle } from '@lib/supabase-utils'

export default apiRoute(async (req, res) => {
  const { supabase, user } = await protectApiRoute({ req, res })

  console.info(`Claim: authed`)

  const subscriptionId = req.body['subscription_id']
  const productId = req.body['product_id']
  if (typeof subscriptionId === 'undefined') {
    res.status(400).json({
      error: 'subscription_id is required',
    })
  }
  if (typeof subscriptionId !== 'string') {
    res.status(400).json({
      error: 'Invalid subscription_id',
    })
    return
  }

  if (typeof productId === 'undefined') {
    res.status(400).json({
      error: 'product_id is required',
    })
  }
  if (typeof productId !== 'string') {
    res.status(400).json({
      error: 'Invalid product_id',
    })
    return
  }

  console.info(`Claim: validated`)

  const subscriptionRes = await supabase
    .from('subscriptions')
    .select('*, subscription_items(id, prices(*, products(*)))')
    .eq('id', subscriptionId)
    .single()

  console.info(`Claim: found subscription`)

  if (subscriptionRes.error) {
    throw postgresError(subscriptionRes.error)
  }

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

          const { message } = await claimProductAccess(subscription, product, user)

          console.info(`Claim: claimed access for product ${product.id}`)

          res.json({
            message,
          })
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
