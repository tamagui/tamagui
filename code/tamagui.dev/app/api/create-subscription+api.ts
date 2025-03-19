import type { Stripe } from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'

// Price IDs for Pro plan
const PRO_SUBSCRIPTION_PRICE_ID = 'price_1QthHSFQGtHoG6xcDOEuFsrW' // $240/year with auto-renew
const PRO_ONE_TIME_PRICE_ID = 'price_1Qs41HFQGtHoG6xcerDq7RJZ' // $400 one-time payment

// New Team Seats Price IDs
const TEAM_SEATS_SUBSCRIPTION_PRICE_ID = 'price_1R3yCAFQGtHoG6xcatVUMGL4'
const TEAM_SEATS_ONE_TIME_PRICE_ID = 'price_1R3yCaFQGtHoG6xcwQ8EtfDu'

type CreateSubscriptionRequest = {
  paymentMethodId: string
  disableAutoRenew: boolean
  couponId?: string
  teamSeats?: number
}

type CreateSubscriptionResponse = {
  id: string
  status?: string | null
  clientSecret: string
}

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const {
    paymentMethodId,
    disableAutoRenew,
    couponId,
    teamSeats = 0,
  } = (await req.json()) as CreateSubscriptionRequest

  if (!paymentMethodId) {
    return Response.json({ error: 'Payment method ID is required' }, { status: 400 })
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

    if (disableAutoRenew) {
      // One-time payment
      const invoiceCreateParams: Stripe.InvoiceCreateParams = {
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        pending_invoice_items_behavior: 'include',
      }

      if (couponId) {
        invoiceCreateParams.discounts = [{ coupon: couponId }]
      }

      // Create base product invoice item
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        price: PRO_ONE_TIME_PRICE_ID,
      })

      // Add team seats if requested
      if (teamSeats > 0) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          price: TEAM_SEATS_ONE_TIME_PRICE_ID,
          quantity: teamSeats,
        })
      }

      // Create and pay invoice with all items
      const invoice = await stripe.invoices.create(invoiceCreateParams)

      try {
        const paidInvoice = await stripe.invoices.pay(invoice.id, {
          expand: ['payment_intent'],
        })

        const paymentIntent = paidInvoice.payment_intent as Stripe.PaymentIntent
        if (!paymentIntent?.client_secret) {
          throw new Error('Failed to get payment intent client secret')
        }

        const response: CreateSubscriptionResponse = {
          id: invoice.id,
          status: invoice.status,
          clientSecret: paymentIntent.client_secret,
        }

        return Response.json(response)
      } catch (error) {
        // If payment fails, void the invoice
        await stripe.invoices.voidInvoice(invoice.id)
        throw error
      }
    } else {
      // Subscription
      const items: Stripe.SubscriptionCreateParams.Item[] = [
        { price: PRO_SUBSCRIPTION_PRICE_ID },
      ]

      if (teamSeats > 0) {
        items.push({
          price: TEAM_SEATS_SUBSCRIPTION_PRICE_ID,
          quantity: teamSeats,
        })
      }

      const subscriptionCreateParams: Stripe.SubscriptionCreateParams = {
        customer: stripeCustomerId,
        items,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      }

      if (couponId) {
        subscriptionCreateParams.coupon = couponId
      }

      const subscription = await stripe.subscriptions.create(subscriptionCreateParams)
      const invoice = subscription.latest_invoice as Stripe.Invoice
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

      if (!paymentIntent?.client_secret) {
        // If we don't get a client secret, cancel the subscription
        await stripe.subscriptions.del(subscription.id)
        throw new Error('Failed to get payment intent client secret')
      }

      const response: CreateSubscriptionResponse = {
        id: subscription.id,
        clientSecret: paymentIntent.client_secret,
      }

      return Response.json(response)
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})
