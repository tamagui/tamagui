import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import { stripe } from '~/features/stripe/stripe'

// V2 support tier type
type SupportTier = 'chat' | 'direct' | 'sponsor'

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

// Get the price ID for a support tier
const getSupportTierPriceId = (tier: SupportTier | number): string | null => {
  // Handle new string-based tiers
  if (tier === 'direct') {
    return STRIPE_PRODUCTS.SUPPORT_DIRECT.priceId
  }
  if (tier === 'sponsor') {
    return STRIPE_PRODUCTS.SUPPORT_SPONSOR.priceId
  }
  if (tier === 'chat') {
    return null // Chat is included, no additional subscription needed
  }

  // Handle legacy numeric tiers (for backwards compatibility)
  if (typeof tier === 'number' && tier > 0) {
    return STRIPE_PRODUCTS.SUPPORT.priceId
  }

  return null
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

    // Handle legacy V1 chat support
    if (chatSupport) {
      items.push({ price: STRIPE_PRODUCTS.CHAT.priceId })
    }

    // Handle support tier (V2 string-based or legacy numeric)
    const supportPriceId = getSupportTierPriceId(supportTier)
    if (supportPriceId) {
      // Legacy numeric tiers used quantity, new string tiers don't
      if (typeof supportTier === 'number' && supportTier > 0) {
        items.push({ price: supportPriceId, quantity: supportTier })
      } else {
        items.push({ price: supportPriceId })
      }
    }

    if (items.length === 0) {
      return Response.json({ error: 'No items selected' }, { status: 400 })
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    })

    // Set it as the default payment method
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })

    // Create subscription for monthly options
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: items,
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      coupon: couponId || undefined,
      default_payment_method: paymentMethodId,
      collection_method: 'charge_automatically',
    })

    const latestInvoice = subscription.latest_invoice as any
    const amountDue = latestInvoice?.amount_due || 0

    // Get client secret safely
    let clientSecret: string | null = null
    if (latestInvoice?.payment_intent) {
      if (typeof latestInvoice.payment_intent === 'string') {
        const paymentIntent = await stripe.paymentIntents.retrieve(
          latestInvoice.payment_intent
        )
        clientSecret = paymentIntent.client_secret
      } else {
        clientSecret = latestInvoice.payment_intent.client_secret
      }
    }

    return Response.json({
      id: subscription.id,
      clientSecret,
      amount_due: amountDue,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
