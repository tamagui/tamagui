import { getURL } from '@lib/helpers'
import { stripe } from '@lib/stripe'
import { supabaseAdmin } from '@lib/supabaseAdmin'
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
  let priceId: string

  // if there's a price id, just use that
  if (typeof req.query.price_id === 'string') {
    priceId = req.query.price_id
  } else {
    // if there's no price id provided, get the product and use the default price id
    if (typeof req.query.product_id !== 'string') {
      res.status(400).json({ error: 'no `priceId` provided.' })
      return
    }

    const product = await stripe.products.retrieve(req.query.product_id)
    if (!product.default_price) {
      throw new Error(
        `Product with id of ${product.id} does not have a default price and no price id is provided.`
      )
    }
    priceId =
      typeof product.default_price === 'string'
        ? product.default_price
        : product.default_price.id
  }

  const customerResult = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .maybeSingle()
  let customerId: string

  if (customerResult.error) {
    throw new Error(customerResult.error.message)
  }
  // if stripe customer doesn't exist, create one and insert it into supabase
  if (customerResult.data?.id) {
    if (!customerResult.data.stripe_customer_id) {
      throw new Error(
        `User with id ${user.id} has a customer row with no stripe ID associated.`
      )
    }
    customerId = customerResult.data.stripe_customer_id
  } else {
    const stripeCustomer = await stripe.customers.create({
      email: user.email,
    })

    await supabaseAdmin
      .from('customers')
      .insert({ id: user.id, stripe_customer_id: stripeCustomer.id })
    customerId = stripeCustomer.id
  }

  const stripeSession = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
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
