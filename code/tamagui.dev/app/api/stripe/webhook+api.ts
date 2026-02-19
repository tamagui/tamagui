import type Stripe from 'stripe'
import * as v from 'valibot'
import { apiRoute } from '~/features/api/apiRoute'
import { getQuery } from '~/features/api/getQuery'
import { readBodyBuffer } from '~/features/api/readBodyBuffer'
import { unclaimSubscription } from '~/features/api/unclaimProduct'
import {
  addRenewalSubscription,
  createTeamSubscription,
  deletePriceRecord,
  deleteProductRecord,
  deleteSubscriptionRecord,
  manageSubscriptionStatusChange,
  upsertPriceRecord,
  upsertProductRecord,
  createTeamInvoice,
} from '~/features/auth/supabaseAdmin'
import { sendProductRenewalEmail, sendV1ExpirationEmail } from '~/features/email/helpers'
import { captureServerError } from '~/features/posthog'
import { stripe } from '~/features/stripe/stripe'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

const endpointSecret = process.env.STRIPE_SIGNING_SIGNATURE_SECRET

const Schema = v.object({
  referral: v.optional(v.string()),
})

export default apiRoute(async (req) => {
  let event: Stripe.Event | null = null

  try {
    if (!endpointSecret) {
      throw new Error('Stripe endpoint secret signature is not set')
    }

    const sig = req.headers.get('stripe-signature')

    if (!sig) {
      console.warn(`No signature found in headers ${req.headers}`)
    }

    const toltReferral = v.parse(Schema, getQuery(req))?.referral
    const reqBuffer = await readBodyBuffer(req)

    if (!reqBuffer) {
      throw new Error(`No body`)
    }

    try {
      event = stripe.webhooks.constructEvent(reqBuffer, sig ?? '', endpointSecret)
    } catch (error) {
      console.error(error)
      return new Response(`Webhook error: ${error}`, {
        status: 400,
      })
    }

    console.info(`Stripe webhook event: ${event.type}`)

    switch (event.type) {
      case 'product.created':
      case 'product.updated':
        await upsertProductRecord(event.data.object as Stripe.Product)
        break
      case 'product.deleted':
        await deleteProductRecord((event.data.object as Stripe.Product).id)

        break

      case 'price.created':
      case 'price.updated':
        await upsertPriceRecord(event.data.object as Stripe.Price)
        break
      case 'price.deleted':
        await deletePriceRecord((event.data.object as Stripe.Price).id)
        break

      case 'invoice.upcoming': {
        const info = event.data.object as Stripe.Invoice

        if (!info.customer_email) {
          console.error(`No email for invoice`)
          return
        }

        // Check if this is a V1 subscription that's expiring
        const isV1Subscription = info.lines.data.some(
          (line) =>
            line.price?.product === STRIPE_PRODUCTS.PRO_SUBSCRIPTION.productId ||
            line.price?.product === STRIPE_PRODUCTS.PRO_TEAM_SEATS.productId
        )

        if (isV1Subscription) {
          // Send V1 expiration email with upgrade info
          const subscriptionId =
            typeof info.subscription === 'string'
              ? info.subscription
              : info.subscription?.id
          if (subscriptionId) {
            await sendV1ExpirationEmail(info.customer_email, {
              name: 'friend',
              subscriptionId,
            })
          }
        } else {
          // Regular renewal email for V2 upgrades
          await sendProductRenewalEmail(info.customer_email, {
            name: 'friend',
            product_name: 'Takeout',
          })
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice

        if (invoice.subscription === null) {
          await manageOneTimePayment(invoice)
          await createTeamInvoice(invoice)
        }
        break
      }

      // TODO
      // case 'customer.updated': {
      //   const data = event.data.object as Stripe.Customer
      //   await updateCustomer(
      //     data
      //   )
      //   break
      // }

      case 'customer.subscription.created': {
        const createdSub = event.data.object as Stripe.Subscription
        await manageSubscriptionStatusChange(
          createdSub.id,
          typeof createdSub.customer === 'string'
            ? createdSub.customer
            : createdSub.customer.id,
          true
        )
        await createTeamSubscription(createdSub)
        break
      }
      case 'customer.subscription.updated': {
        const updatedSub = event.data.object as Stripe.Subscription
        await manageSubscriptionStatusChange(
          updatedSub.id,
          typeof updatedSub.customer === 'string'
            ? updatedSub.customer
            : updatedSub.customer.id
        )
        await createTeamSubscription(updatedSub)
        break
      }
      case 'customer.subscription.deleted': {
        await unclaimSubscription(event.data.object as Stripe.Subscription)
        await deleteSubscriptionRecord(event.data.object as Stripe.Subscription)
        break
      }

      case 'checkout.session.completed': {
        const options = toltReferral ? { toltReferral } : undefined
        await addRenewalSubscription(
          event.data.object as Stripe.Checkout.Session,
          options
        )
        break
      }

      default:
        console.error(
          `Unhandled event type ${event.type}`
          // JSON.stringify(event.data, null, 2)
        )
    }

    return Response.json({
      success: true,
    })
  } catch (err) {
    console.error(`Error occurred in stripe webook endpoint: ${event?.type}`)
    console.error(`Event object: ${JSON.stringify(event?.data.object || null)}`)
    captureServerError(err as Error, {
      endpoint: '/api/stripe/webhook',
      eventType: event?.type,
    })
    throw err
  }
})

async function manageOneTimePayment(invoice: Stripe.Invoice) {
  if (!invoice.customer) {
    throw new Error('No customer found for invoice')
  }

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer.id

  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (noCustomerError) throw noCustomerError

  const { id: uuid } = customerData

  const now = new Date()
  const oneYearFromNow = new Date(now.setFullYear(now.getFullYear() + 1))

  await supabaseAdmin.from('subscriptions').insert({
    id: invoice.id,
    user_id: uuid,
    metadata: invoice.metadata,
    status: 'active',
    cancel_at: oneYearFromNow.toISOString(),
    cancel_at_period_end: true,
    current_period_start: new Date().toISOString(),
    current_period_end: oneYearFromNow.toISOString(),
    created: new Date().toISOString(),
  })

  const subscriptionItems = invoice.lines.data
    .filter((item): item is Stripe.InvoiceLineItem & { price: { id: string } } =>
      Boolean(item.price?.id)
    )
    .map((item) => ({
      id: item.id,
      subscription_id: invoice.id,
      price_id: item.price.id,
    }))

  if (subscriptionItems.length > 0) {
    await supabaseAdmin.from('subscription_items').insert(subscriptionItems)
  }

  // Handle V2 Pro License purchase - create project
  if (invoice.metadata?.type === 'pro_v2_license' && invoice.metadata?.version === 'v2') {
    await createProjectFromV2Purchase(invoice, uuid)
  }
}

/**
 * Create a project and subscriptions from a V2 Pro License purchase
 * Called by webhook after payment succeeds (handles both normal and 3DS flows)
 */
async function createProjectFromV2Purchase(invoice: Stripe.Invoice, userId: string) {
  const projectName = invoice.metadata?.project_name
  const projectDomain = invoice.metadata?.project_domain
  const supportTier = invoice.metadata?.support_tier || 'chat'
  const paymentMethodId = invoice.metadata?.payment_method_id

  if (!projectName || !projectDomain) {
    console.error(
      'V2 invoice missing project_name or project_domain metadata',
      invoice.id
    )
    return
  }

  const customerId =
    typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id

  if (!customerId) {
    console.error('V2 invoice missing customer ID', invoice.id)
    return
  }

  const oneYearFromNow = new Date()
  oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

  // Create the project (may fail if domain already exists - that's ok)
  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: userId,
      name: projectName,
      domain: projectDomain,
      license_purchased_at: new Date().toISOString(),
      updates_expire_at: oneYearFromNow.toISOString(),
    })
    .select()
    .single()

  if (projectError) {
    console.error(
      'Error creating project from V2 purchase (may already exist):',
      projectError
    )
  } else {
    // Add owner as team member only if project was created
    await supabaseAdmin.from('project_team_members').insert({
      project_id: project.id,
      user_id: userId,
      role: 'owner',
    })
    console.info(
      `Created V2 project: ${projectName} (${projectDomain}) for user ${userId}`
    )
  }

  // Create subscriptions if they don't already exist (handles 3DS case)
  // For normal flow, API already created them - webhook checks and skips
  await createV2SubscriptionsIfNeeded({
    customerId,
    projectName,
    projectDomain,
    supportTier,
    paymentMethodId,
  })
}

/**
 * Create V2 subscriptions only if they don't already exist
 * This handles both normal flow (API creates) and 3DS flow (webhook creates)
 */
async function createV2SubscriptionsIfNeeded({
  customerId,
  projectName,
  projectDomain,
  supportTier,
  paymentMethodId,
}: {
  customerId: string
  projectName: string
  projectDomain: string
  supportTier: string
  paymentMethodId?: string
}) {
  try {
    // Check if subscriptions already exist for this project
    const existingSubscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    })

    const hasUpgradeSubscription = existingSubscriptions.data.some(
      (sub) =>
        sub.metadata?.type === 'pro_v2_upgrade' &&
        sub.metadata?.project_domain === projectDomain &&
        sub.status !== 'canceled'
    )

    if (hasUpgradeSubscription) {
      console.info(`V2 subscriptions already exist for ${projectDomain}, skipping`)
      return
    }

    // Create subscriptions (3DS case - API returned early)
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)

    const upgradeSubscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: STRIPE_PRODUCTS.PRO_V2_UPGRADE.priceId }],
      billing_cycle_anchor: Math.floor(oneYearFromNow.getTime() / 1000),
      proration_behavior: 'none',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      ...(paymentMethodId && { default_payment_method: paymentMethodId }),
      metadata: {
        project_name: projectName,
        project_domain: projectDomain,
        version: 'v2',
        type: 'pro_v2_upgrade',
      },
    })

    console.info(
      `Created V2 upgrade subscription: ${upgradeSubscription.id} for ${projectDomain}`
    )

    // Create support subscription if paid tier selected
    if (supportTier === 'direct' || supportTier === 'sponsor') {
      const supportPriceId =
        supportTier === 'direct'
          ? STRIPE_PRODUCTS.SUPPORT_DIRECT.priceId
          : STRIPE_PRODUCTS.SUPPORT_SPONSOR.priceId

      const supportSubscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: supportPriceId }],
        payment_settings: { save_default_payment_method: 'on_subscription' },
        ...(paymentMethodId && { default_payment_method: paymentMethodId }),
        metadata: {
          project_name: projectName,
          project_domain: projectDomain,
          version: 'v2',
          type: 'pro_v2_support',
          support_tier: supportTier,
        },
      })

      console.info(
        `Created V2 ${supportTier} support subscription: ${supportSubscription.id}`
      )
    }
  } catch (error) {
    // Log but don't throw - payment already succeeded
    console.error('Failed to create V2 subscriptions in webhook:', error)
  }
}

// async function handleCreateSubscription(
//   sub: Stripe.Subscription & { plan?: Stripe.Plan; quantity?: number }
// ) {
//   const user = await supabaseAdmin
//     .from('customers')
//     .select('*')
//     .eq('stripe_customer_id', sub.customer)
//     .single()
//   if (user.error) {
//     console.log(`no customer found with customer id of ${sub.customer}`)
//     return
//   }
//   await supabaseAdmin.from('subscriptions').insert({
//     id: sub.id,
//     user_id: user.data.id,
//     cancel_at: sub.cancel_at?.toString(),
//     cancel_at_period_end: sub.cancel_at_period_end,
//     canceled_at: sub.canceled_at?.toString(),
//     created: sub.created.toString(),
//     current_period_end: sub.current_period_end.toString(),
//     current_period_start: sub.current_period_start.toString(),
//     ended_at: sub.ended_at?.toString(),
//     metadata: sub.metadata,
//     price_id: sub.plan?.id,
//     quantity: sub.quantity,
//     status: sub.status,
//     trial_end: sub.trial_end?.toString(),
//     trial_start: sub.trial_start?.toString(),
//   })
// }

// async function handleUpdateSubscription(
//   sub: Stripe.Subscription & { plan?: Stripe.Plan; quantity?: number }
// ) {
//   const user = await supabaseAdmin
//     .from('customers')
//     .select('*')
//     .eq('stripe_customer_id', sub.customer)
//     .single()
//   if (user.error) {
//     console.log(`no customer found with customer id of ${sub.customer}`)
//     return
//   }
//   await supabaseAdmin.from('subscriptions').upsert({
//     id: sub.id,
//     user_id: user.data.id,
//     cancel_at: sub.cancel_at?.toString(),
//     cancel_at_period_end: sub.cancel_at_period_end,
//     canceled_at: sub.canceled_at?.toString(),
//     created: sub.created.toString(),
//     current_period_end: sub.current_period_end.toString(),
//     current_period_start: sub.current_period_start.toString(),
//     ended_at: sub.ended_at?.toString(),
//     metadata: sub.metadata,
//     price_id: sub.plan?.id,
//     quantity: sub.quantity,
//     status: sub.status,
//     trial_end: sub.trial_end?.toString(),
//     trial_start: sub.trial_start?.toString(),
//   })
// }

// async function handleDeleteSubcription(
//   sub: Stripe.Subscription & { plan?: Stripe.Plan; quantity?: number }
// ) {
//   const user = await supabaseAdmin
//     .from('customers')
//     .select('*')
//     .eq('stripe_customer_id', sub.customer)
//     .single()
//   if (user.error) {
//     console.log(`no customer found with customer id of ${sub.customer}`)
//     return
//   }
//   await supabaseAdmin.from('subscriptions').delete().eq('id', sub.id)
// }
