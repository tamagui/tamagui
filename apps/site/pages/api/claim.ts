import { claimProductAccess } from '@lib/claim-product'
import { Database } from '@lib/supabase-types'
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
    .select('*, prices(id, products(*))')
    .eq('id', subscriptionId)
    .single()

  if (subscriptionRes.error) throw subscriptionRes.error

  const subscription = subscriptionRes.data

  if (!subscription.prices) {
    throw new Error('No prices found.')
  }
  const price = Array.isArray(subscription.prices)
    ? subscription.prices[0]
    : subscription.prices

  const products = price.products
    ? Array.isArray(price.products)
      ? price.products
      : [price.products]
    : null
  if (!products) {
    throw new Error('No products found.')
  }

  const product = products.find((p) => p.id === productId)

  if (!product) {
    throw new Error('No product match')
  }

  const { message } = await claimProductAccess(subscription, product, user)
  res.json({
    message,
  })
}

export default handler
