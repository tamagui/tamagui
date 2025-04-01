import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import type Stripe from 'stripe'

const TEAM_SEATS_SUBSCRIPTION_PRICE_ID = STRIPE_PRODUCTS.PRO_TEAM_SEATS.priceId
const TEAM_SEATS_ONE_TIME_PRICE_ID = STRIPE_PRODUCTS.PRO_TEAM_SEATS_ONE_TIME.priceId

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { paymentMethodId, subscriptionId, additionalSeats } = await req.json()

  if (!paymentMethodId || !subscriptionId || !additionalSeats) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  try {
    const { user } = await ensureAuth({ req })
    const stripeCustomerId = await createOrRetrieveCustomer({
      email: user.email!,
      uuid: user.id,
    })

    if (!stripeCustomerId) {
      return Response.json({ error: 'Failed to get or create customer' }, { status: 500 })
    }

    // Get the subscription to check if it's a subscription or one-time payment
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const isSubscription = subscription.status === 'active'

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

    if (isSubscription) {
      // Add seats to existing subscription
      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        items: [
          {
            price: TEAM_SEATS_SUBSCRIPTION_PRICE_ID,
            quantity: additionalSeats,
          },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      })

      const latestInvoice = updatedSubscription.latest_invoice as Stripe.Invoice
      const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent

      return Response.json({
        id: updatedSubscription.id,
        clientSecret: paymentIntent.client_secret,
        type: 'subscription',
      })
    } else {
      // Create one-time payment invoice for additional seats
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        price: TEAM_SEATS_ONE_TIME_PRICE_ID,
        quantity: additionalSeats,
      })

      const invoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
      })

      const paidInvoice = await stripe.invoices.pay(invoice.id, {
        expand: ['payment_intent'],
      })

      return Response.json({
        id: invoice.id,
        status: invoice.status,
        type: 'invoice',
      })
    }
  } catch (error) {
    console.error('Error adding team seats:', error)
    return Response.json({ error: 'Failed to add team seats' }, { status: 500 })
  }
})
