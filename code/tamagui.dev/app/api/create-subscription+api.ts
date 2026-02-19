import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { captureServerError } from '~/features/posthog'
import { stripe } from '~/features/stripe/stripe'
import type Stripe from 'stripe'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

// Price IDs for Pro plan
const PRO_SUBSCRIPTION_PRICE_ID = STRIPE_PRODUCTS.PRO_SUBSCRIPTION.priceId
const PRO_ONE_TIME_PRICE_ID = STRIPE_PRODUCTS.PRO_ONE_TIME.priceId

// New Team Seats Price IDs
const TEAM_SEATS_SUBSCRIPTION_PRICE_ID = STRIPE_PRODUCTS.PRO_TEAM_SEATS.priceId
const TEAM_SEATS_ONE_TIME_PRICE_ID = STRIPE_PRODUCTS.PRO_TEAM_SEATS_ONE_TIME.priceId
export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { paymentMethodId, disableAutoRenew, couponId, teamSeats } = await req.json()

  const teamSeatCount = Number(teamSeats)

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
      // Create invoice item for one-time payment
      await stripe.invoiceItems.create({
        customer: stripeCustomerId,
        price: PRO_ONE_TIME_PRICE_ID,
      })

      if (teamSeatCount > 0) {
        await stripe.invoiceItems.create({
          customer: stripeCustomerId,
          price: TEAM_SEATS_ONE_TIME_PRICE_ID,
          quantity: teamSeatCount,
        })
      }

      // Create and pay invoice
      const invoice = await stripe.invoices.create({
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        discounts: couponId ? [{ coupon: couponId }] : [],
      })

      const paidInvoice = await stripe.invoices.pay(invoice.id, {
        expand: ['payment_intent'],
      })

      return Response.json({
        id: invoice.id,
        status: invoice.status,
        // We don't actually need this for one-time payments, but let's keep it for consistency
        // clientSecret: await getClientSecret(paidInvoice),
      })
    } else {
      let items: Stripe.SubscriptionCreateParams.Item[] = [
        { price: PRO_SUBSCRIPTION_PRICE_ID },
      ]

      if (teamSeatCount > 0) {
        items.push({ price: TEAM_SEATS_SUBSCRIPTION_PRICE_ID, quantity: teamSeatCount })
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: stripeCustomerId,
        items,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
        coupon: couponId || undefined,
        default_payment_method: paymentMethodId,
      })

      const latestInvoice = subscription.latest_invoice as Stripe.Invoice
      const amountDue = latestInvoice?.amount_due || 0
      const clientSecret = await getClientSecret(subscription)

      return Response.json({
        id: subscription.id,
        clientSecret,
        amount_due: amountDue,
      })
    }
  } catch (error) {
    console.error('Error creating subscription:', error)
    captureServerError(error as Error, { endpoint: '/api/create-subscription' })
    return Response.json({ error: 'Failed to create subscription' }, { status: 500 })
  }
})

// Helper function to get client secret from subscription or invoice
async function getClientSecret(
  subscription: Stripe.Subscription | Stripe.Invoice
): Promise<string | null> {
  // First try to get from the expanded payment_intent
  let paymentIntent = (
    (subscription as Stripe.Subscription).latest_invoice as Stripe.Invoice
  )?.payment_intent

  if (paymentIntent && (paymentIntent as Stripe.PaymentIntent).client_secret) {
    return (paymentIntent as Stripe.PaymentIntent).client_secret
  }

  // If not found, retrieve the invoice and try again
  const invoice = await stripe.invoices.retrieve(
    ((subscription as Stripe.Subscription).latest_invoice as Stripe.Invoice).id,
    { expand: ['payment_intent'] }
  )
  if (typeof invoice.payment_intent === 'string') {
    paymentIntent = await stripe.paymentIntents.retrieve(invoice.payment_intent)
  } else {
    paymentIntent = invoice.payment_intent as Stripe.PaymentIntent
  }
  return paymentIntent?.client_secret || null
}
