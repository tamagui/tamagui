import { claimProductAccess } from '@lib/claim-product'
import { Database } from '@lib/supabase-types'
import { getArray, getSingle } from '@lib/supabase-utils'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    res.status(401).json({
      error: 'The user is not authenticated',
    })
    return
  }
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

  const subscriptionRes = await supabase
    .from('subscriptions')
    .select('*, subscription_items(id, prices(*, products(*)))')
    .eq('id', subscriptionId)
    .single()

  if (subscriptionRes.error) throw subscriptionRes.error

  const subscription = subscriptionRes.data

  const prices = getArray(subscriptionRes.data.subscription_items).map((s) =>
    getSingle(s?.prices)
  )

  for (const price of prices) {
    for (const product of getArray(price?.products)) {
      if (!product) continue
      if (product.id === productId) {
        try {
          const { message } = await claimProductAccess(subscription, product, user)
          res.json({
            message,
          })
        } catch (error) {
          res.status(500).json({
            message: error.message,
          })
        }
        return
      }
    }
  }

  res.status(404).json({ error: 'no product matched' })
}

export default handler
