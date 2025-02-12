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

  const productIdsParam = query.product_ids
  if (typeof productIdsParam === 'undefined') {
    return Response.json({ error: 'no product_ids provided' }, { status: 400 })
  }

  // e.g. product_ids=123,456,789
  const productIds = Array.isArray(productIdsParam)
    ? productIdsParam
    : productIdsParam.split(',')

  const autoRenewQuery = query.auto_renew
  const cancelAtPeriodEnd =
    typeof autoRenewQuery === 'string' && autoRenewQuery.toLowerCase() === 'false'

  const supportTierParam = query.support_tier
  const supportTier = supportTierParam ? Number(supportTierParam) : 0

  const productsResponse = await stripe.products.list({ ids: productIds })
  const productsData = productsResponse.data

  const productsMap: Record<string, any> = {}
  for (const product of productsData) {
    productsMap[product.id] = product
    if (!product.default_price) {
      throw new Error(`Product with id ${product.id} does not have a default price`)
    }
  }

  const stripeCustomerId = await createOrRetrieveCustomer({
    email: user.email!,
    uuid: user.id,
  })
  if (!stripeCustomerId) {
    throw new Error(`Something went wrong with createOrRetrieveCustomer.`)
  }

  console.info(`Creating stripe session for checkout`)

  // Prepare line items for the checkout session
  const lineItems: { price: string; quantity: number }[] = []

  // Add Pro subscription
  if (productsMap['prod_tamagui_pro']) {
    const proProduct = productsMap['prod_tamagui_pro']
    const queryProPriceId = query[`price-${proProduct.id}`]
    const proPriceId =
      typeof queryProPriceId === 'string'
        ? queryProPriceId
        : typeof proProduct.default_price === 'string'
          ? proProduct.default_price
          : proProduct.default_price.id

    lineItems.push({
      price: proPriceId,
      quantity: 1,
    })
  }

  // Add Chat Support subscription
  if (productsMap['prod_tamagui_chat']) {
    const chatProduct = productsMap['prod_tamagui_chat']
    const queryChatPriceId = query[`price-${chatProduct.id}`]
    const chatPriceId =
      typeof queryChatPriceId === 'string'
        ? queryChatPriceId
        : typeof chatProduct.default_price === 'string'
          ? chatProduct.default_price
          : chatProduct.default_price.id

    lineItems.push({
      price: chatPriceId,
      quantity: 1,
    })
  }

  // Add Support Tier subscription
  if (productsMap['prod_tamagui_support_tier'] && supportTier > 0) {
    const supportProduct = productsMap['prod_tamagui_support_tier']
    const querySupportPriceId = query[`price-${supportProduct.id}`]
    const supportPriceId =
      typeof querySupportPriceId === 'string'
        ? querySupportPriceId
        : typeof supportProduct.default_price === 'string'
          ? supportProduct.default_price
          : supportProduct.default_price.id

    lineItems.push({
      price: supportPriceId,
      quantity: supportTier,
    })
  }

  // Create a single checkout session with all products
  const checkoutSession = await stripe.checkout.sessions.create({
    line_items: lineItems,
    customer: stripeCustomerId,
    mode: 'subscription',
    success_url: `${getURL()}/payment-finished`,
    cancel_url: `${getURL()}/takeout`,
    customer_update: {
      name: 'auto',
      address: 'auto',
      shipping: 'auto',
    },
    tax_id_collection: { enabled: true },
    // @ts-ignore
    custom_text: {
      submit: {
        message: 'One-click cancel from your account on tamagui.dev/account',
      },
    },
  })

  // Handle auto-renew setting after session creation
  if (cancelAtPeriodEnd && typeof checkoutSession.subscription === 'string') {
    await stripe.subscriptions.update(checkoutSession.subscription, {
      cancel_at_period_end: true,
    })
  }

  if (checkoutSession.url) {
    return Response.redirect(checkoutSession.url)
  }

  throw new Error(`No stripe session URL in: ${JSON.stringify(checkoutSession)}`)
})
