import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { stripe } from '~/features/stripe/stripe'

const CHAT_SUPPORT_PRICE_ID = 'price_1NqKJ3FQGtHoG6xcQ8Y9X8X8'
const SUPPORT_TIER_PRICE_ID = 'price_1QrulKFQGtHoG6xcDs9OYTFu'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
  const { subscriptionId, chatSupport, supportTier, disableAutoRenew } = await req.json()

  if (!subscriptionId) {
    return Response.json({ error: 'Subscription ID is required' }, { status: 400 })
  }

  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const items: { price: string; quantity?: number }[] = []

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

    // Create a new subscription for monthly add-ons
    if (items.length > 0) {
      const monthlySubscription = await stripe.subscriptions.create({
        customer: subscription.customer as string,
        items,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        cancel_at_period_end: disableAutoRenew || false,
      })

      return Response.json({
        subscriptionId: monthlySubscription.id,
        clientSecret: (monthlySubscription.latest_invoice as any).payment_intent
          ?.client_secret,
      })
    }

    return Response.json({ message: 'No upgrades selected' })
  } catch (error) {
    console.error('Error upgrading subscription:', error)
    return Response.json({ error: 'Failed to upgrade subscription' }, { status: 500 })
  }
})
