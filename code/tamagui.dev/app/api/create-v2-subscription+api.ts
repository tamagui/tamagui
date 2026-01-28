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

/**
 * V2 Pro Purchase Flow:
 * 1. Charge $999 one-time for license
 * 2. Create $300/year upgrade subscription (starts in 1 year)
 * 3. If support tier selected (direct/sponsor), create monthly subscription
 * 4. Project is created after successful payment via webhook
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

  try {
    const { supabase, user } = await ensureAuth({ req })

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

    // Calculate when the upgrade subscription should start (1 year from now)
    const upgradeStartDate = new Date()
    upgradeStartDate.setFullYear(upgradeStartDate.getFullYear() + 1)

    // Create invoice for the $999 one-time license fee
    await stripe.invoiceItems.create({
      customer: stripeCustomerId,
      price: PRO_V2_LICENSE_PRICE_ID,
      metadata: {
        project_name: projectName,
        project_domain: projectDomain,
        version: 'v2',
      },
    })

    // Create and pay the invoice
    const invoice = await stripe.invoices.create({
      customer: stripeCustomerId,
      collection_method: 'charge_automatically',
      auto_advance: true,
      discounts: couponId ? [{ coupon: couponId }] : [],
      metadata: {
        project_name: projectName,
        project_domain: projectDomain,
        version: 'v2',
        type: 'pro_v2_license',
      },
    })

    const paidInvoice = await stripe.invoices.pay(invoice.id, {
      expand: ['payment_intent'],
    })

    // Create the upgrade subscription (starts in 1 year, $300/year)
    // This is auto-subscribed as per requirements
    const upgradeSubscription = await stripe.subscriptions.create({
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
    })

    // If a paid support tier is selected, create the support subscription
    let supportSubscriptionId: string | null = null
    const supportPriceId = supportTier ? getSupportTierPriceId(supportTier) : null
    if (supportPriceId) {
      const supportSubscription = await stripe.subscriptions.create({
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
      })
      supportSubscriptionId = supportSubscription.id
    }

    return Response.json({
      success: true,
      invoiceId: invoice.id,
      invoiceStatus: paidInvoice.status,
      upgradeSubscriptionId: upgradeSubscription.id,
      upgradeStartDate: upgradeStartDate.toISOString(),
      supportSubscriptionId,
      supportTier: supportTier || 'chat',
      projectName,
      projectDomain,
    })
  } catch (error) {
    console.error('Error creating v2 subscription:', error)
    const message =
      error instanceof Error ? error.message : 'Failed to create subscription'
    return Response.json({ error: message }, { status: 500 })
  }
})
