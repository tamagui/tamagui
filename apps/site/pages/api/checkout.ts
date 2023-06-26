import { getURL } from '@lib/helpers'
import { stripe } from '@lib/stripe'
import { createOrRetrieveCustomer } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    const params = new URLSearchParams({ redirect_to: req.url ?? '' })
    res.redirect(303, `/login?${params.toString()}`)
    return
  }
  // let priceId: string

  // const quantity =
  //   typeof req.query.quantity === 'string' &&
  //   !isNaN(Number(req.query.quantity)) &&
  //   Number(req.query.quantity) > 0
  //     ? Number(req.query.quantity)
  //     : 1

  // // if there's a price id, just use that
  // if (typeof req.query.price_id === 'string') {
  //   priceId = req.query.price_id
  // } else  {
  //   // if there's no price id provided, get the product and use the default price id
  //   if (typeof req.query.product_id !== 'string') {
  //     res.status(400).json({ error: 'no `priceId` provided.' })
  //     return
  //   }

  if (typeof req.query.product_id === 'undefined') {
    res.status(400).json({ error: 'no `product_id` provided' })
    return
  }
  const productIds = Array.isArray(req.query.product_id)
    ? req.query.product_id
    : [req.query.product_id]
  const products = await stripe.products.list({ ids: productIds })
  for (const product of products.data) {
    if (!product.default_price) {
      throw new Error(
        `Product with id of ${product.id} does not have a default price and no price id is provided.`
      )
    }
  }
  let coupon: string | undefined

  if (req.query.coupon && typeof req.query.coupon === 'string') {
    coupon = req.query.coupon
  }
  // priceId =
  //   typeof product.default_price === 'string'
  //     ? product.default_price
  //     : product.default_price.id

  const stripeCustomerId = await createOrRetrieveCustomer({
    email: user.email!,
    uuid: user.id,
  })

  if (!stripeCustomerId) {
    throw new Error(`Something went wrong with createOrRetrieveCustomer.`)
  }
  // if stripe customer doesn't exist, create one and insert it into supabase

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: products.data.map((product) => {
      // can use ! cause we've checked before
      const queryPriceId = req.query[`price-${product.id}`]
      let priceId =
        typeof product.default_price! === 'string'
          ? product.default_price
          : product.default_price!.id

      if (typeof queryPriceId === 'string') {
        priceId = queryPriceId
      }

      return {
        price: priceId,
        quantity: 1,
      }
    }),
    customer: stripeCustomerId,
    mode: 'subscription',
    discounts: coupon ? [{ coupon }] : undefined,
    success_url: `${getURL()}/account/subscriptions`,
    cancel_url: `${getURL()}/takeout`,
  })

  // await supabaseAdmin
  //   .from('customers')
  //   .upsert({ id: user.id, stripe_customer_id: stripeSession.customer })

  if (stripeSession.url) {
    res.redirect(303, stripeSession.url)
  }

  res.status(500)
}

export default handler
