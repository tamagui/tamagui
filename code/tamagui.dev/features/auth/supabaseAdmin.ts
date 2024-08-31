import { createClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { sendProductPurchaseEmail } from '~/features/email/helpers'
import { stripe } from '~/features/stripe/stripe'
import type { Price, Product } from '~/features/stripe/types'
import type { Database } from '../supabase/types'

const SUPA_URL = import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

console.info(`Connecting to supabase: ${SUPA_URL} with key? ${!!SUPA_KEY}`)

// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin priviliges and overwrites RLS policies!
export const supabaseAdmin = createClient<Database>(SUPA_URL, SUPA_KEY)

const toDateTime = (secs: number) => {
  const t = new Date('1970-01-01T00:30:00Z') // Unix epoch start.
  t.setSeconds(secs)
  return t
}

export const getBentoCode = async (codePath: string) => {
  const { data, error } = await supabaseAdmin.storage
    .from('bento')
    .download(`merged/${codePath}.tsx`)
  if (error) {
    console.error(error)
    throw new Error(`Error getting bento code for ${codePath}`)
  }
  return data.text()
}

export const getBentoComponentCategory = async ({
  categoryPath,
  categorySectionPath,
  fileName,
}: {
  categoryPath: string
  categorySectionPath?: string
  fileName?: string
}) => {
  let rootPath = `${categoryPath}`
  if (categorySectionPath) {
    rootPath += `/${categorySectionPath}`
  }

  const downloadPath = `unmerged/${rootPath}`

  const { data: fileList, error } = await supabaseAdmin.storage
    .from('bento')
    .list(downloadPath)

  if (error) {
    throw new Error(`Error getting bento code for ${categoryPath} ${categorySectionPath}`)
  }

  let result: { [key: string]: Array<{ path: string; downloadUrl: string }> } = {}

  const processFolder = async (folderPath: string, folderName: string) => {
    const { data: subFileList, error: subError } = await supabaseAdmin.storage
      .from('bento')
      .list(folderPath)

    if (subError) {
      throw new Error(`Error getting bento code for ${folderPath}`)
    }

    const subFiles = await Promise.all(
      subFileList.map(async (subFile) => {
        const { data: signedUrl, error: signError } = await supabaseAdmin.storage
          .from('bento')
          .createSignedUrl(`${folderPath}/${subFile.name}`, 60)

        if (signError) {
          throw new Error(`Error creating signed URL for ${subFile.name}`)
        }

        return {
          path: `${folderName}/${subFile.name}`,
          downloadUrl: signedUrl.signedUrl,
        }
      })
    )

    return subFiles.filter(
      (file): file is { path: string; downloadUrl: string } => file !== null
    )
  }

  for (const item of fileList) {
    if (item.id === null) {
      // This is a folder, process its contents
      const folderFiles = await processFolder(
        `${downloadPath}/${item.name}`,
        `${rootPath}/${item.name}`
      )
      if (folderFiles.length > 0) {
        result[`${rootPath}/${item.name}`] = folderFiles
      }
    } else if (item.name.includes(fileName || '')) {
      // This is a file in the main folder
      const { data: signedUrl, error: signError } = await supabaseAdmin.storage
        .from('bento')
        .createSignedUrl(`${downloadPath}/${item.name}`, 60)

      if (signError) {
        throw new Error(`Error creating signed URL for ${item.name}`)
      }

      result[rootPath] = result[rootPath] || []
      result[rootPath].push({
        path: item.name,
        downloadUrl: signedUrl.signedUrl,
      })
    }
  }
  return result
}

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
  console.info(`Product inserted/updated: ${product.id}`)
}

export const deleteProductRecord = async (id: Stripe.Product['id']) => {
  const { error } = await supabaseAdmin.from('products').delete().eq('id', id)
  if (error) throw error
  console.info(`Product deleted: ${id}`)
}

export const upsertPriceRecord = async (price: Stripe.Price) => {
  const priceData: Price = {
    id: price.id,
    product_id: typeof price.product === 'string' ? price.product : price.product.id,
    active: price.active,
    currency: price.currency,
    description: price.nickname ?? undefined,
    type: price.type,
    unit_amount: price.unit_amount!,
    interval: price.recurring?.interval,
    interval_count: price.recurring?.interval_count,
    trial_period_days: price.recurring?.trial_period_days,
    metadata: price.metadata,
  }

  // @ts-expect-error
  const { error } = await supabaseAdmin.from('prices').upsert([priceData])
  if (error) throw error
  console.info(`Price inserted/updated: ${price.id}`)

  // we call this to create associated subscription prices upfront - instead of creating it on the fly when someone purchases a one-time price.
  await getOrCreateRenewalPriceId(price)
}

export const deletePriceRecord = async (id: Stripe.Price['id']) => {
  const { error } = await supabaseAdmin.from('prices').delete().eq('id', id)
  if (error) throw error
  console.info(`Price deleted: ${id}`)
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
    console.info(`createOrRetrieveCustomer ${uuid}`)
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

  console.info(`Insert new subscriptions`)
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
  if (error) {
    throw error
  }

  // instead of deleting right away, we collect them to delete after the insert below
  // because we have a contsraint on app_installations and i dont want to mess that up
  console.info(`Find old subscription_items`)
  const { error: findSubsErr, data: oldSubscriptionItems } = await supabaseAdmin
    .from('subscription_items')
    .select('*')
    .eq('subscription_id', subscription.id)
  if (findSubsErr) {
    throw findSubsErr
  }

  console.info(`Insert new subscription_items`)
  const { error: insertionError } = await supabaseAdmin.from('subscription_items').upsert(
    subscription.items.data.map((item) => ({
      id: item.id,
      subscription_id: subscription.id,
      price_id: typeof item.price === 'string' ? item.price : item.price.id,
    }))
  )
  if (insertionError) {
    throw insertionError
  }

  // then delete the old ones since we inserted new ones so shouldn't cause contraint err:
  if (oldSubscriptionItems?.length) {
    const oldRecords = oldSubscriptionItems
      .map((x) => x.id)
      .filter((id) => !subscription.items.data.some((x) => x.id === id))
    console.info(`Delete old subscription_items`, oldRecords)
    const { error: deleteOldErr } = await supabaseAdmin
      .from('subscription_items')
      .delete()
      .in(
        'id',
        // delete ones that aren't leftover
        oldRecords
      )
    if (deleteOldErr) {
      throw deleteOldErr
    }
  }

  console.info(`Inserted/updated subscription [${subscription.id}] for user [${uuid}]`)
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

    const subscribedProducts = await Promise.all(
      subscription.items.data.map((item) =>
        stripe.products.retrieve(item.price.product as string)
      )
    )
    const userName = userModel.data.full_name ?? email.split('@').shift()!
    const includesTakeoutStarter = subscribedProducts.some(
      (product) => product.metadata.slug === 'universal-starter'
    )
    if (includesTakeoutStarter) {
      await sendProductPurchaseEmail(email, {
        name: userName,
        product_name: 'Takeout',
      })
      console.info(`Takeout purchase email request sent to Postmark for ${email}`)
    }
    const includesBento = subscribedProducts.some(
      (product) => product.metadata.slug === 'bento'
    )
    if (includesBento) {
      await sendProductPurchaseEmail(email, {
        name: userName,
        product_name: 'Bento',
      })
      console.info(`Bento purchase email request sent to Postmark for ${email}`)
    }
  }
}

export async function deleteSubscriptionRecord(sub: Stripe.Subscription) {
  const { error } = await supabaseAdmin.from('subscriptions').delete().eq('id', sub.id)
  if (error) throw error
  console.error(`Deleted subscription: ${sub.id}`)
}

export async function addRenewalSubscription(
  sessionFromEvent: Stripe.Checkout.Session,
  options?: { toltReferral?: string }
) {
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

  const customerId =
    typeof session.customer === 'string' ? session.customer : session.customer!.id

  const { data: userData, error: userError } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()
  if (userError) {
    throw userError
  }
  const userId = userData.id

  const renewalPriceIds: string[] = []
  for (const price of prices) {
    if (price.metadata.is_lifetime) {
      // create ownership record for the user if it's for lifetime
      await supabaseAdmin.from('product_ownership').insert({
        price_id: price.id,
        user_id: userId,
      })
      continue
    }
    // else, we need to:
    // 1. get or create a recurring price
    // 2. set up a subscription to the price with 1 year of trial so that it starts charging after 1y
    // we add the 1y trial because the user just paid for the first year
    if (typeof price.product === 'string' || price.product.deleted) {
      console.warn('no product object - returning')
      continue
    }
    const renewalPriceId = await getOrCreateRenewalPriceId(price)
    if (!renewalPriceId) {
      console.warn('no has_renewals metadata found - returning')
      continue
    }
    renewalPriceIds.push(renewalPriceId)
  }

  if (renewalPriceIds.length > 0) {
    const toltReferral = options?.toltReferral ?? null

    const cardPaymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    })
    const paymentMethod = cardPaymentMethods.data[0]
    const collectionMethod = paymentMethod ? 'charge_automatically' : 'send_invoice'
    const renewalSub = await stripe.subscriptions.create({
      ...(toltReferral && {
        metadata: {
          tolt_referral: toltReferral,
        },
      }),
      customer: customerId,
      collection_method: collectionMethod,
      ...(collectionMethod === 'charge_automatically'
        ? {
            default_payment_method: paymentMethod.id,
          }
        : {
            days_until_due: 5,
          }),
      trial_period_days: 365,
      // billing_cycle_anchor: (function () {
      //   const date = new Date()
      //   date.setFullYear(date.getFullYear() + 1)
      //   return Math.floor(Number(date) / 1000)
      // })(),
      items: renewalPriceIds.map((id) => ({
        price: id,
      })),
    })
    console.info(renewalSub)
  }
}

export async function getOrCreateRenewalPriceId(price: Stripe.Price) {
  let product =
    price.product && typeof price.product === 'object'
      ? (price.product as Stripe.Product)
      : await stripe.products.retrieve(price.product)
  if (
    !product.metadata.has_renewals || // this product doesn't need renewal prices
    price.type === 'recurring' || // this price is already a subscription price - not having this check might cause an infinite loop of creating prices
    price.metadata.is_lifetime // there is no need for creating a subscription as this is a lifetime purchase
  ) {
    return null
  }

  let renewalPriceId = price.metadata.renewal_price_id
  if (!price.metadata.renewal_price_id) {
    const subscriptionPrice = await stripe.prices.create({
      product: typeof price.product === 'string' ? price.product : price.product.id,
      currency: 'USD',
      nickname: `${price.nickname} | Subscription for ${price.id} (Auto-generated)`,
      recurring: { interval: 'year', interval_count: 1 },
      unit_amount: price.unit_amount!, // change this to `unit_amount: price.unit_amount! / 2` for 50% prices (make sure to remove old prices to trigger this)
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
  return renewalPriceId
}

export async function populateStripeData() {
  // products
  const products = await stripe.products.list({ limit: 100 })
  for (const product of products.data) {
    await upsertProductRecord(product)
    console.info('populated product', product.name)
  }

  // prices
  const prices = await stripe.prices.list({ limit: 100 })
  for (const price of prices.data) {
    await upsertPriceRecord(price)
    console.info('populated price ', price.nickname)
  }
}
