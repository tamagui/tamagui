import { apiRoute } from '@lib/apiRoute'
import { getURL } from '@lib/helpers'
import { protectApiRoute } from '@lib/protectApiRoute'
import { stripe } from '@lib/stripe'
import { createOrRetrieveCustomer } from '@lib/supabaseAdmin'

export default apiRoute(async (req, res) => {
  const { user } = await protectApiRoute({ req, res, shouldRedirect: true })
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
  let couponId: string | undefined

  if (req.query.coupon_id && typeof req.query.coupon_id === 'string') {
    couponId = req.query.coupon_id
  }

  let promoCode: string | undefined
  let promoCodeId: string | undefined

  if (req.query.promotion_code && typeof req.query.promotion_code === 'string') {
    promoCode = req.query.promotion_code

    const promoCodeRes = await stripe.promotionCodes.list({
      code: promoCode,
      active: true,
    })
    if (promoCodeRes.data.length > 0) {
      promoCodeId = promoCodeRes.data[0].id
    }
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
    discounts: promoCodeId
      ? [{ promotion_code: promoCodeId }]
      : couponId
      ? [{ coupon: couponId }]
      : undefined,
    mode: 'payment',
    success_url: `${getURL()}/payment-finished`,
    cancel_url: `${getURL()}/takeout`,
  })

  // await supabaseAdmin
  //   .from('customers')
  //   .upsert({ id: user.id, stripe_customer_id: stripeSession.customer })

  if (stripeSession.url) {
    return res.redirect(303, stripeSession.url)
  }

  throw new Error(`No stripe session URL in: ${JSON.stringify(stripeSession)}`)
})
