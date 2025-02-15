import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })
  const {
    paymentMethodId,
    proPriceId,
    supportPriceIds = [],
    disableAutoRenew,
  } = await req.json()

  if (!paymentMethodId || !proPriceId) {
    return Response.json(
      { error: 'Payment method ID and Pro plan price ID are required' },
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
      return Response.json({ error: 'Failed to get or create customer' }, { status: 500 })
    }

    // Attach payment method to customer
    await stripe.paymentMethods
      .attach(paymentMethodId, {
        customer: stripeCustomerId,
      })
      .catch((error) => {
        console.error('Error attaching payment method:', error)
        return Response.json(
          { error: 'Failed to attach payment method' },
          { status: 500 }
        )
      })

    // Set as default payment method
    await stripe.customers
      .update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      })
      .catch((error) => {
        console.error('Error updating customer:', error)
        return Response.json({ error: 'Failed to update customer' }, { status: 500 })
      })

    // Get the Pro plan price details and verify it's recurring
    const priceDetails = await stripe.prices.retrieve(proPriceId)
    if (priceDetails.type !== 'recurring') {
      return Response.json(
        { error: 'Pro plan price must be recurring type' },
        { status: 400 }
      )
    }

    // Create the subscription with Pro plan
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: proPriceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      cancel_at_period_end: disableAutoRenew || false,
    })

    // If there are support prices, create a separate subscription for them
    if (supportPriceIds.length > 0) {
      const supportSubscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items: supportPriceIds.map((priceId) => ({ price: priceId })),
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        cancel_at_period_end: disableAutoRenew || false,
      })
    }

    return Response.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any).payment_intent?.client_secret,
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
