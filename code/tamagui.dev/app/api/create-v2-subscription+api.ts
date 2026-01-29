import type Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

// V2 Price IDs
const PRO_V2_LICENSE_PRICE_ID = STRIPE_PRODUCTS.PRO_V2_LICENSE.priceId
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
 * 1. Charge $999 one-time for license
 * 2. Create $300/year upgrade subscription (starts in 1 year)
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

  const { paymentMethodId, projectName, projectDomain, couponId, supportTier } =
    await req.json()

  // Validate required fields
  if (!paymentMethodId) {
    return Response.json({ error: 'Payment method is required' }, { status: 400 })
  }

  if (!projectName || projectName.length <= 2) {
    return Response.json(
      { error: 'Project name must be more than 2 characters' },
      { status: 400 }
    )
  }

  if (!projectDomain || projectDomain.length <= 2) {
    return Response.json(
      { error: 'Project domain must be more than 2 characters' },
      { status: 400 }
    )
  }

  // Track created resources for rollback
  let paidInvoice: Stripe.Invoice | null = null
  let upgradeSubscription: Stripe.Subscription | null = null
  let supportSubscription: Stripe.Subscription | null = null

  try {
    const { supabase, user } = await ensureAuth({ req })
    const idempotencyBase = `${user.id}_${projectDomain}`

    // Check if domain is already in use
    const { data: existingProject } = await supabase
      .from('projects')
      .select('id')
      .eq('domain', projectDomain)
      .single()

    if (existingProject) {
      return Response.json(
        { error: 'This domain is already registered to a project' },
        { status: 409 }
      )
    }

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
        { idempotencyKey: generateIdempotencyKey(user.id, 'attach_pm', idempotencyBase) }
      )
    } catch (attachError) {
      const err = attachError as Stripe.errors.StripeError
      if (err.code === 'card_declined') {
        return Response.json(
          { error: 'Your card was declined. Please try a different payment method.' },
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

    // Create invoice for the $999 one-time license fee
    await stripe.invoiceItems.create(
      {
        customer: stripeCustomerId,
        price: PRO_V2_LICENSE_PRICE_ID,
        metadata: {
          project_name: projectName,
          project_domain: projectDomain,
          version: 'v2',
        },
      },
      { idempotencyKey: generateIdempotencyKey(user.id, 'invoice_item', idempotencyBase) }
    )

    // Create and pay the invoice
    // Include support_tier in metadata for webhook to create subscriptions if 3DS required
    const invoice = await stripe.invoices.create(
      {
        customer: stripeCustomerId,
        collection_method: 'charge_automatically',
        auto_advance: true,
        discounts: couponId ? [{ coupon: couponId }] : [],
        metadata: {
          project_name: projectName,
          project_domain: projectDomain,
          version: 'v2',
          type: 'pro_v2_license',
          support_tier: supportTier || 'chat',
          payment_method_id: paymentMethodId,
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

    // Create the upgrade subscription (starts in 1 year, $300/year)
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
            project_name: projectName,
            project_domain: projectDomain,
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
            payment_settings: { save_default_payment_method: 'on_subscription' },
            default_payment_method: paymentMethodId,
            metadata: {
              project_name: projectName,
              project_domain: projectDomain,
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
      projectName,
      projectDomain,
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
