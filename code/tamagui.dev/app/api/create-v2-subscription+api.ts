import type Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { getParityDiscount } from '~/features/geo-pricing/parityConfig'
import { getTrustedCountryCode } from '~/features/geo-pricing/trustedCountry'
import { getCheckoutCouponId } from '~/features/site/purchase/promoConfig'
import { assertValidCoupon } from '~/features/stripe/assertValidCoupon'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import { stripe } from '~/features/stripe/stripe'
import { getV2LicenseInvoiceItemCreateParams } from '~/features/stripe/v2LicenseInvoiceItem'

// V2 Price IDs
const PRO_V2_UPGRADE_PRICE_ID = STRIPE_PRODUCTS.PRO_V2_UPGRADE.priceId

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
 * 1. Charge $250 one-time for license
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
  const checkoutCouponId = getCheckoutCouponId(couponId)

  // Validate required fields
  if (!paymentMethodId) {
    return Response.json({ error: 'Payment method is required' }, { status: 400 })
  }

  // Parity discount applies to the actual charge, so the country must come from a
  // request proven to have transited Cloudflare (getTrustedCountryCode) -- a direct
  // origin hit can't spoof CF-IPCountry to discount the price. Unverified -> null ->
  // 0% discount (full price).
  const countryCode = getTrustedCountryCode(req)
  const parityDiscountPercent = getParityDiscount(countryCode)

  // Track created resources for rollback
  let paidInvoice: Stripe.Invoice | null = null
  let upgradeSubscription: Stripe.Subscription | null = null
  let supportSubscription: Stripe.Subscription | null = null

  try {
    const { user } = await ensureAuth({ req })

    // server-side coupon validation: the requested or configured promotion must be
    // valid and apply to the V2 license product before it discounts the charge.
    if (checkoutCouponId) {
      await assertValidCoupon(checkoutCouponId, STRIPE_PRODUCTS.PRO_V2_LICENSE.productId)
    }

    // Deterministic idempotency base so request retries reuse Stripe operations.
    // paymentMethodId is unique per submit attempt, so a new checkout attempt still works.
    const idempotencyBase = [
      user.id,
      paymentMethodId,
      checkoutCouponId || 'no_coupon',
      supportTier || 'chat',
      countryCode || 'XX',
    ].join('_')

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

    // create invoice item for the license fee, keeping parity prices on the v2 product
    await stripe.invoiceItems.create(
      getV2LicenseInvoiceItemCreateParams({
        stripeCustomerId,
        parityDiscountPercent,
        countryCode,
      }),
      {
        idempotencyKey: generateIdempotencyKey(user.id, 'invoice_item', idempotencyBase),
      }
    )

    // Create and pay the invoice
    // Coupon (beta discount) applies on top of parity-adjusted price
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        discounts: checkoutCouponId ? [{ coupon: checkoutCouponId }] : [],
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

    // V2 purchase succeeded - clean up any lingering V1 Pro subscriptions so the
    // customer doesn't keep getting renewal/failed-payment emails for the old plan.
    // non-blocking: V1 cleanup must not fail the V2 purchase.
    await cancelV1ProSubscriptionsOnV2Migration(stripeCustomerId)

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
 * After a successful V2 purchase, cancel any V1 Pro subscriptions for the same customer.
 * - past_due/unpaid/incomplete: cancel immediately and void any open invoices (stops the
 *   stripe retry loop and the "Payment failed" email it generates).
 * - active/trialing: set cancel_at_period_end so the customer keeps the period they paid for
 *   but doesn't get charged again.
 *
 * Wrapped in try/catch - failure here must not affect the V2 purchase response.
 */
async function cancelV1ProSubscriptionsOnV2Migration(stripeCustomerId: string) {
  try {
    const subs = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: 'all',
      limit: 20,
    })

    const v1ProProductId = STRIPE_PRODUCTS.PRO_SUBSCRIPTION.productId
    const v1ProSubs = subs.data.filter((sub) => {
      const product = sub.items.data[0]?.price.product
      return (
        product === v1ProProductId &&
        (sub.status === 'active' ||
          sub.status === 'trialing' ||
          sub.status === 'past_due' ||
          sub.status === 'unpaid' ||
          sub.status === 'incomplete' ||
          sub.status === 'canceled')
      )
    })

    for (const sub of v1ProSubs) {
      const isFailing =
        sub.status === 'past_due' ||
        sub.status === 'unpaid' ||
        sub.status === 'incomplete'
      const shouldVoidOpenInvoices = isFailing || sub.status === 'canceled'

      if (shouldVoidOpenInvoices) {
        const openInvoices = await stripe.invoices.list({
          customer: stripeCustomerId,
          subscription: sub.id,
          status: 'open',
          limit: 10,
        })
        for (const inv of openInvoices.data) {
          try {
            await stripe.invoices.voidInvoice(inv.id)
            console.info(`Voided open V1 invoice ${inv.id} on V2 migration`)
          } catch (e) {
            console.error(`Failed to void V1 invoice ${inv.id}:`, e)
          }
        }
      }

      if (isFailing) {
        await stripe.subscriptions.cancel(sub.id)
        console.info(
          `Canceled failing V1 Pro subscription ${sub.id} (was ${sub.status}) on V2 migration`
        )
      } else if (sub.status === 'canceled') {
        console.info(
          `Voided open invoices for canceled V1 Pro subscription ${sub.id} on V2 migration`
        )
      } else {
        await stripe.subscriptions.update(sub.id, {
          cancel_at_period_end: true,
          metadata: {
            ...sub.metadata,
            canceled_reason: 'v2_purchase_migration',
          },
        })
        console.info(
          `Set V1 Pro subscription ${sub.id} to cancel at period end on V2 migration`
        )
      }
    }
  } catch (err) {
    console.error('cancelV1ProSubscriptionsOnV2Migration failed:', err)
  }
}

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
