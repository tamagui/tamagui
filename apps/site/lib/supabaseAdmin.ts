import { SupabaseClient, createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { Price, Product } from 'types'

import { sendTakeoutWelcomeEmail } from './email'
import { toDateTime } from './helpers'
import { stripe } from './stripe'
import { Database } from './supabase-types'

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabaseAdmin = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    )
  : ((() => {}) as any as SupabaseClient<Database>)

export const upsertProductRecord = async (product: Stripe.Product) => {
  const productData: Product = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? undefined,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  }

  const { error } = await supabaseAdmin.from('products').upsert([productData])
  if (error) throw error
  console.log(`Product inserted/updated: ${product.id}`)
}

export const deleteProductRecord = async (id: Stripe.Product['id']) => {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) throw error
  console.log(`Product deleted: ${id}`)
}

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : '',
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount! / 2, // 50%
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  }

  // @ts-expect-error
  const { error } = await supabaseAdmin.from('prices').upsert([priceData])
  if (error) throw error
  console.log(`Price inserted/updated: ${price.id}`)
}

export const deletePriceRecord = async (id: Stripe.Price['id']) => {
  const { error } = await supabaseAdmin.from('prices').delete().eq('id', id)
  if (error) throw error
  console.log(`Price deleted: ${id}`)
}

export const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string
  uuid: string
}) => {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', uuid)
    .single()
  if (error) {
    // No customer record found, let's create one.
    const customerData: { metadata: { supabaseUUID: string }; email?: string } = {
      metadata: {
        supabaseUUID: uuid,
      },
    }
    if (email) customerData.email = email
    const customer = await stripe.customers.create(customerData)
    // Now insert the customer ID into our Supabase mapping table.
    const { error: supabaseError } = await supabaseAdmin
      .from('customers')
      .insert([{ id: uuid, stripe_customer_id: customer.id }])
    if (supabaseError) throw supabaseError
    console.log(`New customer created and inserted for ${uuid}.`)
    return customer.id
  }
  if (data) return data.stripe_customer_id
}

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string
  const { name, phone, address } = payment_method.billing_details
  if (!name || !phone || !address) return
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address })
  const { error } = await supabaseAdmin
    .from('users')
    .update({
      // billing_address: address,
      // payment_method: payment_method[payment_method.type],
    })
    .eq('id', uuid)
  if (error) throw error
}

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false
) => {
  // Get customer's UUID from mapping table.
  const { data: customerData, error: noCustomerError } = await supabaseAdmin
    .from('customers')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single()

  if (noCustomerError) throw noCustomerError

  const { id: uuid } = customerData || {}
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ['default_payment_method'],
  })

  const { error } = await supabaseAdmin.from('subscriptions').upsert([
    {
      id: subscription.id,
      user_id: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      //TODO check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end: subscription.cancel_at_period_end,
      cancel_at: subscription.cancel_at
        ? (toDateTime(subscription.cancel_at) as unknown as string)
        : null,
      canceled_at: subscription.canceled_at
        ? (toDateTime(subscription.canceled_at) as unknown as string)
        : null,
      current_period_start: toDateTime(
        subscription.current_period_start
      ) as unknown as string,
      current_period_end: toDateTime(
        subscription.current_period_end
      ) as unknown as string,
      created: toDateTime(subscription.created) as unknown as string,
      ended_at: subscription.ended_at
        ? (toDateTime(subscription.ended_at) as unknown as string)
        : null,
      trial_start: subscription.trial_start
        ? (toDateTime(subscription.trial_start) as unknown as string)
        : null,
      trial_end: subscription.trial_end
        ? (toDateTime(subscription.trial_end) as unknown as string)
        : null,
    },
  ])
  if (error) throw error
  const { error: deletionError } = await supabaseAdmin
    .from('subscription_items')
    .delete()
    .eq('subscription_id', subscription.id)
  if (deletionError) throw deletionError
  const { error: insertionError } = await supabaseAdmin.from('subscription_items').insert(
    subscription.items.data.map((item) => ({
      id: item.id,
      subscription_id: subscription.id,
      price_id: typeof item.price === 'string' ? item.price : item.price.id,
    }))
  )
  if (insertionError) throw insertionError

  console.log(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`)
  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid) {
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod
    )
  }

  // legacy way of handling 50% renewals:
  // const renewalCouponId = process.env.TAKEOUT_RENEWAL_COUPON_ID
  // if (createAction && renewalCouponId) {
  //   await stripe.subscriptions.update(subscription.id, {
  //     coupon: renewalCouponId,
  //   })
  // }

  if (createAction) {
    const user = await supabaseAdmin.auth.admin.getUserById(customerData.id)

    if (user.error) {
      throw user.error
    }
    const email = user.data.user.email
    if (!email) {
      throw new Error(`No email found for user ${user.data.user.id}`)
    }

    const userModel = await supabaseAdmin
      .from('users')
      .select('id, full_name')
      .eq('id', user.data.user.id)
      .single()

    if (userModel.error) {
      throw userModel.error
    }

    await sendTakeoutWelcomeEmail(email, {
      name: userModel.data.full_name ?? email.split('@').shift()!,
    })
    console.log(`Welcome email request sent to Postmark for ${email}`)
  }
}

export async function deleteSubscriptionRecord(sub: Stripe.Subscription) {
  const { error } = await supabaseAdmin.from('subscriptions').delete().eq('id', sub.id)
  if (error) throw error
  console.log(`Deleted subscription: ${sub.id}`)
}

export async function addRenewalSubscription(sessionFromEvent: Stripe.Checkout.Session) {
  const session = await stripe.checkout.sessions.retrieve(sessionFromEvent.id, {
    expand: ['line_items'],
  })

  const prices = await Promise.all(
    session.line_items!.data.map((lineItem) =>
      stripe.prices.retrieve(lineItem.price!.id, {
        expand: ['product'],
      })
    )
  )

  const renewalPriceIds: string[] = []
  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer!.id
  for (const price of prices) {
    if (typeof price.product === 'string' || price.product.deleted) {
      console.warn('no product object - returning')
      continue
    }
    if (!price.product.metadata.has_renewals) {
      console.warn('no has_renewals metadata found - returning')
      continue
    }
    let renewalPriceId = price.metadata.renewal_price_id
    if (!price.metadata.renewal_price_id) {
      const subscriptionPrice = await stripe.prices.create({
        product: typeof price.product === 'string' ? price.product : price.product.id,
        currency: 'USD',
        nickname: `Subscription for ${price.id} (Auto-generated)`,
        recurring: { interval: 'year', interval_count: 1 },
        unit_amount: price.unit_amount ?? undefined,
        metadata: {
          hide_from_lists: 1,
        },
      })
      renewalPriceId = subscriptionPrice.id
      await stripe.prices.update(price.id, {
        metadata: {
          ...price.metadata,
          renewal_price_id: subscriptionPrice.id,
        },
      })
    }

    renewalPriceIds.push(renewalPriceId)
  }
  console.log('creating the sub...', renewalPriceIds)
  if (renewalPriceIds.length > 0) {
    const cardPaymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })
    const paymentMethod = cardPaymentMethods.data[0]
    const collectionMethod = paymentMethod ? 'charge_automatically' : 'send_invoice'
    const renewalSub = await stripe.subscriptions.create({
      customer: customerId,
      collection_method: collectionMethod,
      ...(collectionMethod === 'charge_automatically'
        ? {
            default_payment_method: paymentMethod.id,
          }
        : {
            days_until_due: 5,
          }),

      billing_cycle_anchor: (function () {
        const date = new Date()
        date.setFullYear(date.getFullYear() + 1)
        return Math.floor(Number(date) / 1000)
      })(),
      items: renewalPriceIds.map((id) => ({
        price: id,
      })),
    })
    console.log(renewalSub)
  }
}

// commented cause supabase code is outdated
// export {
//   upsertProductRecord,
//   upsertPriceRecord,
//   createOrRetrieveCustomer,
//   manageSubscriptionStatusChange,
// }
