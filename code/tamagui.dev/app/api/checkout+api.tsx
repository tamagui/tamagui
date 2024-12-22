import { getURL } from 'one'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getQuery } from '~/features/api/getQuery'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { checkDiscountEligibility } from '~/features/site/purchase/checkDiscountEligibility'
import { stripe } from '~/features/stripe/stripe'
import { getUserAccessInfo } from '~/features/user/helpers'

export const GET = apiRoute(async (req) => {
  const { supabase, user } = await ensureAuth({ req, shouldRedirect: true })
  const query = getQuery(req)
  const product_id = query.product_id
  const disable_automatic_discount = query.disable_automatic_discount

  if (typeof product_id === 'undefined') {
    return Response.json({ error: 'no `product_id` provided' }, { status: 400 })
  }

  const productIds = Array.isArray(product_id) ? product_id : [product_id]
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

  // if (!disable_automatic_discount) {
  //   if (
  //     checkDiscountEligibility({
  //       accessInfo: userAccessInfo,
  //       purchaseContainsBento,
  //       purchaseContainsTakeout,
  //     })
  //   ) {
  //     // apply the "takeout + bento" coupon
  //     couponId =
  //       process.env.STRIPE_COMBO_COUPON ??
  //       (process.env.NODE_ENV === 'production' ? '1bJD4ngB' : 'SjRwUFIw')
  //   }
  // }

  const stripeCustomerId = await createOrRetrieveCustomer({
    email: user.email!,
    uuid: user.id,
  })

  if (!stripeCustomerId) {
    throw new Error(`Something went wrong with createOrRetrieveCustomer.`)
  }

  console.info(`Creating stripe session for checkout`)

  // if stripe customer doesn't exist, create one and insert it into supabase
  const stripeSession = await stripe.checkout.sessions.create({
    line_items: products.data.map((product) => {
      // can use ! cause we've checked before
      const queryPriceId = query[`price-${product.id}`]
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
    customer_update: {
      name: 'auto',
      address: 'auto',
      shipping: 'auto',
    },
    tax_id_collection: {
      enabled: true,
    },
    // @ts-ignore
    custom_text: {
      submit: {
        message: 'One-click cancel from your account on tamagui.dev/account',
      },
    },
  })

  console.info(
    `Stripe checkout, redirect: ${stripeSession.url}\n  internal url ${getURL()}`
  )

  if (stripeSession.url) {
    return Response.redirect(stripeSession.url)
  }

  throw new Error(`No stripe session URL in: ${JSON.stringify(stripeSession)}`)
})
