import { apiRoute } from '@lib/apiRoute'
import { checkDiscountEligibility } from '@lib/discount-eligibility'
import { getURL } from '@lib/helpers'
import { protectApiRoute } from '@lib/protectApiRoute'
import { stripe } from '@lib/stripe'
import { createOrRetrieveCustomer } from '@lib/supabaseAdmin'
import { getUserAccessInfo } from '@lib/user-helpers'

export default apiRoute(async (req, res) => {
  const { user, supabase } = await protectApiRoute({ req, res, shouldRedirect: true })
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

  const userAccessInfo = await getUserAccessInfo(supabase, user)

  const purchaseContainsBento = products.data.some(
    (product) => product.metadata.slug === 'bento'
  )
  const purchaseContainsTakeout = products.data.some(
    (product) => product.metadata.slug === 'universal-starter'
  )

  if (!req.query.disable_automatic_discount) {
    if (
      checkDiscountEligibility({
        accessInfo: userAccessInfo,
        purchaseContainsBento,
        purchaseContainsTakeout,
      })
    ) {
      // apply the "takeout + bento" coupon
      couponId = process.env.NODE_ENV === 'production' ? '1bJD4ngB' : 'SjRwUFIw'
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
    mode: 'payment',
    success_url: `${getURL()}/payment-finished`,
    cancel_url: `${getURL()}/takeout`,
    discounts: couponId ? [{ coupon: couponId }] : undefined,
    allow_promotion_codes: couponId ? undefined : true,

    // tax_id_collection: {
    //   enabled: true,
    // },

    // @ts-ignore
    custom_text: {
      submit: {
        message: 'One-click cancel from your account on tamagui.dev/account',
      },
    },
  })

  // await supabaseAdmin
  //   .from('customers')
  //   .upsert({ id: user.id, stripe_customer_id: stripeSession.customer })

  if (stripeSession.url) {
    res.redirect(303, stripeSession.url)
    return
  }

  throw new Error(`No stripe session URL in: ${JSON.stringify(stripeSession)}`)
})
