import type Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { getParityDiscount } from '~/features/geo-pricing/parityConfig'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import { stripe } from '~/features/stripe/stripe'

// V2 Price IDs
const PRO_V2_LICENSE_PRICE_ID = STRIPE_PRODUCTS.PRO_V2_LICENSE.priceId
const PRO_V2_UPGRADE_PRICE_ID = STRIPE_PRODUCTS.PRO_V2_UPGRADE.priceId

// base price in cents
const V2_LICENSE_PRICE_CENTS = 35000

// V2 support tier type
type SupportTier = 'chat' | 'direct' | 'sponsor'

// Get the price ID for a support tier
const getSupportTierPriceId = (tier: SupportTier): string | null => {
  if (tier === 'direct') {
    return STRIPE_PRODUCTS.SUPPORT_DIRECT.priceId
  }
  if (tier === 'sponsor') {
    return STRIPE_PRODUCTS.SUPPORT_SPONSOR.priceId
  }
  return null // Chat is included, no additional subscription needed
}

// Generate idempotency key for Stripe API calls (deterministic for retries)
const generateIdempotencyKey = (userId: string, action: string, uniqueData: string) => {
  return `v2_${userId}_${action}_${uniqueData}`
}

/**
 * V2 Pro Purchase Flow:
 * 1. Charge $350 one-time for license
 * 2. Create $100/year upgrade subscription (starts in 1 year)
 * 3. If support tier selected (direct/sponsor), create monthly subscription
 * 4. Project is created after successful payment via webhook
 *
 * Includes:
 * - Idempotency keys to prevent duplicate charges
 * - Rollback logic for partial failures
 * - 3DS authentication handling (requires_action)
 */
export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  // Project info is now collected after payment in the account modal
  const { paymentMethodId, couponId, supportTier } = await req.json()

  // Validate required fields
  if (!paymentMethodId) {
    return Response.json({ error: 'Payment method is required' }, { status: 400 })
  }

  // Get parity discount from Cloudflare header (server-side validation - can't be spoofed)
  const countryCode = req.headers.get('CF-IPCountry')
  const parityDiscountPercent = getParityDiscount(countryCode)

  // Track created resources for rollback
  let paidInvoice: Stripe.Invoice | null = null
  let upgradeSubscription: Stripe.Subscription | null = null
  let supportSubscription: Stripe.Subscription | null = null

  try {
    const { user } = await ensureAuth({ req })
    // use timestamp for idempotency since we no longer have project domain at purchase time
    const idempotencyBase = `${user.id}_${Date.now()}`

    const stripeCustomerId = await createOrRetrieveCustomer({
      email: user.email!,
      uuid: user.id,
    })

    if (!stripeCustomerId) {
      return Response.json({ error: 'Failed to get or create customer' }, { status: 500 })
    }

    // Attach the payment method to the customer with specific error handling
    try {
      await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: stripeCustomerId },
        {
          idempotencyKey: generateIdempotencyKey(user.id, 'attach_pm', idempotencyBase),
        }
      )
    } catch (attachError) {
      const err = attachError as Stripe.errors.StripeError
      if (err.code === 'card_declined') {
        return Response.json(
          {
            error: 'Your card was declined. Please try a different payment method.',
          },
          { status: 402 }
        )
      }
      if (err.code === 'expired_card') {
        return Response.json(
          { error: 'Your card has expired. Please use a different card.' },
          { status: 402 }
        )
      }
      if (err.code === 'incorrect_cvc') {
        return Response.json(
          { error: 'Incorrect CVC. Please check your card details.' },
          { status: 402 }
        )
      }
      if (err.code === 'payment_method_invalid') {
        return Response.json(
          { error: 'Invalid payment method. Please try again.' },
          { status: 400 }
        )
      }
      throw attachError
    }

    // Set it as the default payment method
    await stripe.customers.update(
      stripeCustomerId,
      {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      },
      {
        idempotencyKey: generateIdempotencyKey(
          user.id,
          'update_customer',
          idempotencyBase
        ),
      }
    )

    // Calculate when the upgrade subscription should start (1 year from now)
    const upgradeStartDate = new Date()
    upgradeStartDate.setFullYear(upgradeStartDate.getFullYear() + 1)

    // Calculate price with parity discount applied
    // Parity discount is applied first, then coupon (beta discount) stacks on top
    const parityAdjustedPrice =
      parityDiscountPercent > 0
        ? Math.round(V2_LICENSE_PRICE_CENTS * (1 - parityDiscountPercent / 100))
        : V2_LICENSE_PRICE_CENTS

    // Create invoice for the license fee (with parity discount baked in)
    // If parity applies, use custom amount. Otherwise use standard price.
    if (parityDiscountPercent > 0) {
      // custom price with parity discount
      await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          amount: parityAdjustedPrice,
          currency: 'usd',
          description: `Tamagui Pro V2 License (${parityDiscountPercent}% parity discount for ${countryCode})`,
          metadata: {
            version: 'v2',
            parity_discount: String(parityDiscountPercent),
            parity_country: countryCode || '',
            original_price_cents: String(V2_LICENSE_PRICE_CENTS),
          },
        },
        {
          idempotencyKey: generateIdempotencyKey(
            user.id,
            'invoice_item',
            idempotencyBase
          ),
        }
      )
    } else {
      // standard price, no parity
      await stripe.invoiceItems.create(
        {
          customer: stripeCustomerId,
          price: PRO_V2_LICENSE_PRICE_ID,
          metadata: {
            version: 'v2',
          },
        },
        {
          idempotencyKey: generateIdempotencyKey(
            user.id,
            'invoice_item',
            idempotencyBase
          ),
        }
      )
    }

    // Create and pay the invoice
    // Coupon (beta discount) applies on top of parity-adjusted price
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        discounts: couponId ? [{ coupon: couponId }] : [],
        metadata: {
          version: 'v2',
          type: 'pro_v2_license',
          support_tier: supportTier || 'chat',
          payment_method_id: paymentMethodId,
          ...(parityDiscountPercent > 0 && {
            parity_discount: String(parityDiscountPercent),
            parity_country: countryCode || '',
          }),
        },
      },
      {
        idempotencyKey: generateIdempotencyKey(
          user.id,
          'create_invoice',
          idempotencyBase
        ),
      }
    )

    paidInvoice = await stripe.invoices.pay(invoice.id, {
      expand: ['payment_intent'],
    })

    // Check if 3DS authentication is required
    const paymentIntent = paidInvoice.payment_intent as Stripe.PaymentIntent | null
    if (paymentIntent?.status === 'requires_action') {
      return Response.json({
        success: false,
        status: 'requires_action',
        clientSecret: paymentIntent.client_secret,
        invoiceId: invoice.id,
        message: 'Additional authentication required',
      })
    }

    // Verify payment succeeded before creating subscriptions
    if (paidInvoice.status !== 'paid') {
      return Response.json(
        { error: 'Payment failed. Please try again.' },
        { status: 402 }
      )
    }

    // Create the upgrade subscription (starts in 1 year, $100/year)
    // This is auto-subscribed as per requirements
    try {
      upgradeSubscription = await stripe.subscriptions.create(
        {
          customer: stripeCustomerId,
          items: [{ price: PRO_V2_UPGRADE_PRICE_ID }],
          billing_cycle_anchor: Math.floor(upgradeStartDate.getTime() / 1000),
          proration_behavior: 'none',
          payment_settings: { save_default_payment_method: 'on_subscription' },
          default_payment_method: paymentMethodId,
          metadata: {
            version: 'v2',
            type: 'pro_v2_upgrade',
          },
        },
        {
          idempotencyKey: generateIdempotencyKey(user.id, 'upgrade_sub', idempotencyBase),
        }
      )
    } catch (subError) {
      // Rollback: refund the invoice if subscription creation fails
      console.error(
        'Upgrade subscription creation failed, initiating rollback:',
        subError
      )
      await rollbackPayment(paidInvoice)
      throw subError
    }

    // If a paid support tier is selected, create the support subscription
    const supportPriceId = supportTier ? getSupportTierPriceId(supportTier) : null
    if (supportPriceId) {
      try {
        supportSubscription = await stripe.subscriptions.create(
          {
            customer: stripeCustomerId,
            items: [{ price: supportPriceId }],
            payment_settings: {
              save_default_payment_method: 'on_subscription',
            },
            default_payment_method: paymentMethodId,
            metadata: {
              version: 'v2',
              type: 'pro_v2_support',
              support_tier: supportTier,
            },
          },
          {
            idempotencyKey: generateIdempotencyKey(
              user.id,
              'support_sub',
              idempotencyBase
            ),
          }
        )
      } catch (supportError) {
        // Rollback: cancel upgrade subscription and refund invoice
        console.error(
          'Support subscription creation failed, initiating rollback:',
          supportError
        )
        await rollbackPayment(paidInvoice, upgradeSubscription)
        throw supportError
      }
    }

    return Response.json({
      success: true,
      invoiceId: invoice.id,
      invoiceStatus: paidInvoice.status,
      upgradeSubscriptionId: upgradeSubscription.id,
      upgradeStartDate: upgradeStartDate.toISOString(),
      supportSubscriptionId: supportSubscription?.id || null,
      supportTier: supportTier || 'chat',
    })
  } catch (error) {
    console.error('Error creating v2 subscription:', error)

    // Check for Stripe-specific errors
    if ((error as Stripe.errors.StripeError).type === 'StripeCardError') {
      const stripeError = error as Stripe.errors.StripeError
      return Response.json(
        { error: stripeError.message || 'Payment failed' },
        { status: 402 }
      )
    }

    const message =
      error instanceof Error ? error.message : 'Failed to create subscription'
    return Response.json({ error: message }, { status: 500 })
  }
})

/**
 * Rollback payment and subscriptions on failure
 */
async function rollbackPayment(
  invoice: Stripe.Invoice | null,
  upgradeSubscription?: Stripe.Subscription | null
) {
  try {
    // Cancel upgrade subscription if created
    if (upgradeSubscription) {
      await stripe.subscriptions.cancel(upgradeSubscription.id)
      console.info(`Rolled back upgrade subscription: ${upgradeSubscription.id}`)
    }

    // Refund the invoice payment
    if (invoice?.charge) {
      const chargeId =
        typeof invoice.charge === 'string' ? invoice.charge : invoice.charge.id
      await stripe.refunds.create({ charge: chargeId })
      console.info(`Refunded charge for invoice: ${invoice.id}`)
    }
  } catch (rollbackError) {
    // Log but don't throw - the original error is more important
    console.error('Rollback failed:', rollbackError)
  }
}
