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

  try {
    const body = await req.json()
    const { paymentMethodId, subscriptionId, additionalSeats, couponId } = body

    if (!paymentMethodId || !subscriptionId || !additionalSeats) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

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
      try {
        // First get the existing subscription items
        const existingSubscription = await stripe.subscriptions.retrieve(subscriptionId, {
          expand: ['items'],
        })

        // Find the team seats subscription item
        const teamSeatsItem = existingSubscription.items.data.find(
          (item) => item.price.id === TEAM_SEATS_SUBSCRIPTION_PRICE_ID
        )

        let updatedSubscription
        if (teamSeatsItem) {
          // Update existing team seats subscription
          updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [
              {
                id: teamSeatsItem.id,
                quantity: teamSeatsItem.quantity + additionalSeats,
              },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            coupon: couponId || undefined,
          })
        } else {
          // Create new team seats subscription
          updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            items: [
              {
                price: TEAM_SEATS_SUBSCRIPTION_PRICE_ID,
                quantity: additionalSeats,
              },
            ],
            payment_behavior: 'default_incomplete',
            payment_settings: { save_default_payment_method: 'on_subscription' },
            expand: ['latest_invoice.payment_intent'],
            coupon: couponId || undefined,
          })
        }

        const latestInvoice = updatedSubscription.latest_invoice as Stripe.Invoice
        const paymentIntent = latestInvoice.payment_intent as Stripe.PaymentIntent

        if (!paymentIntent?.client_secret) {
          throw new Error('No client secret found in payment intent')
        }

        return Response.json({
          id: updatedSubscription.id,
          clientSecret: paymentIntent.client_secret,
          type: 'subscription',
        })
      } catch (err) {
        const error = err as Error
        return Response.json(
          { error: 'Failed to update subscription', details: error.message },
          { status: 500 }
        )
      }
    } else {
      try {
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
          discounts: couponId ? [{ coupon: couponId }] : [],
        })

        const paidInvoice = await stripe.invoices.pay(invoice.id, {
          expand: ['payment_intent'],
        })

        if (!paidInvoice) {
          throw new Error('Failed to process invoice payment')
        }

        return Response.json({
          id: invoice.id,
          status: invoice.status,
          type: 'invoice',
        })
      } catch (err) {
        const error = err as Error
        return Response.json(
          { error: 'Failed to process payment', details: error.message },
          { status: 500 }
        )
      }
    }
  } catch (err) {
    const error = err as Error
    return Response.json(
      { error: 'Failed to add team seats', details: error.message },
      { status: 500 }
    )
  }
})
