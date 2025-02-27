import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { stripe } from '~/features/stripe/stripe'

// Price IDs for monthly options
const CHAT_SUPPORT_PRICE_ID = 'price_1QrukQFQGtHoG6xcMpB125IR'
const SUPPORT_TIER_PRICE_ID = 'price_1QrulKFQGtHoG6xcDs9OYTFu'

// Helper function to get or create a Stripe customer
const getOrCreateStripeCustomer = async (user: any) => {
  const { data: customers } = await stripe.customers.list({
    email: user.email,
    limit: 1,
  })

  if (customers.length > 0) {
    return customers[0].id
  }

  const newCustomer = await stripe.customers.create({
    email: user.email,
    metadata: {
      supabaseUUID: user.id,
    },
  })

  return newCustomer.id
}

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { subscriptionId, paymentMethodId, chatSupport, supportTier, couponId } =
    await req.json()

  if (!paymentMethodId) {
    return Response.json({ error: 'Payment method ID is required' }, { status: 400 })
  }

  try {
    const { user } = await ensureAuth({ req })
    const stripeCustomerId = await getOrCreateStripeCustomer(user)

    // Build items array based on selected options
    const items: Array<{ price: string; quantity?: number }> = []
    if (chatSupport) {
      items.push({ price: CHAT_SUPPORT_PRICE_ID })
    }
    if (supportTier > 0) {
      items.push({ price: SUPPORT_TIER_PRICE_ID, quantity: supportTier })
    }

    if (items.length === 0) {
      return Response.json({ error: 'No items selected' }, { status: 400 })
    }

    // Create subscription for monthly options
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: items,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      coupon: couponId || undefined,
    })

    return Response.json({
      id: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent.client_secret,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
