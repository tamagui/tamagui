import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'

const CHAT_SUPPORT_PRICE_ID = 'price_1NqKJ3FQGtHoG6xcQ8Y9X8X8'
const SUPPORT_TIER_PRICE_ID = 'price_1NqKJFFQGtHoG6xcY2X9X8X8'

export const POST = apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const { paymentMethodId, priceId, disableAutoRenew, chatSupport, supportTier } =
    await req.json()

  if (!paymentMethodId || !priceId) {
    return Response.json(
      { error: 'Payment method ID and price ID are required' },
      { status: 400 }
    )
  }

  try {
    // Get or create customer
    const stripeCustomerId = await createOrRetrieveCustomer({
      email: user.email!,
      uuid: user.id,
    })

    if (!stripeCustomerId) {
      throw new Error('Failed to get or create customer')
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    })

    // Set as default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Prepare subscription items
    const items = [{ price: priceId, quantity: 1 }]

    // Add chat support if selected
    if (chatSupport) {
      items.push({
        price: CHAT_SUPPORT_PRICE_ID,
        quantity: 1,
      })
    }

    // Add support tier if selected
    if (supportTier > 0) {
      items.push({
        price: SUPPORT_TIER_PRICE_ID,
        quantity: supportTier,
      })
    }

    // Create the subscription with all items
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      cancel_at_period_end: disableAutoRenew || false,
    })

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent?.client_secret,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
