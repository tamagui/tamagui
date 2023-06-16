import { getURL } from '@lib/helpers'
import { stripe } from '@lib/stripe'
import { createOrRetrieveCustomer, supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!session || !user) {
    const params = new URLSearchParams({ redirect_to: req.url ?? '' })
    res.redirect(303, `/login?${params.toString()}`)
    return
  }

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
      let priceId =
        typeof product.default_price! === 'string'
          ? product.default_price
          : product.default_price!.id

      // check if product price is provided
      const queryPrice = req.query[`price-${product.id}`]
      if (typeof queryPrice === 'string') priceId = queryPrice

      return {
        price: priceId,
        quantity: 1,
      }
    }),
    customer: stripeCustomerId,
    mode: 'subscription',
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
