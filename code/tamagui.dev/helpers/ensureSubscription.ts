import type { SupabaseClient } from '@supabase/supabase-js'
import { getArray } from './getArray'
import { getSingle } from './getSingle'
import { getTakeoutPriceInfo } from '../features/site/purchase/getProductInfo'

export async function ensureSubscription(
  supabase: SupabaseClient<any, 'public', any>,
  subscriptionId?: string | null
) {
  if (!subscriptionId) {
    throw Response.json(
      {
        message: 'no subscription id provided.',
      },
      {
        status: 404,
      }
    )
  }

  const subscription = await supabase
    .from('subscriptions')
    .select(
      'id, metadata, created, subscription_items(id, prices(id, description, products(id, name, metadata)))'
    )
    .eq('id', subscriptionId)
    .single()

  if (subscription.error) {
    throw Response.json(
      {
        message: 'no subscription with the provided id found that belongs to your user.',
      },
      {
        status: 404,
      }
    )
  }

  const subscriptionData = getArray(subscription.data.subscription_items).find(
    (item) =>
      (getSingle(getSingle(item?.prices)?.products)?.metadata as Record<string, any>)
        ?.slug === 'universal-starter'
  )

  if (!subscriptionData) {
    throw Response.json(
      {
        message: 'the provided subscription does not include the takeout starter',
      },
      {
        status: 401,
      }
    )
  }

  const pricingDescription = getSingle(
    subscriptionData.prices
  )?.description?.toLowerCase()

  if (!pricingDescription) {
    console.warn(`No price description: ${JSON.stringify(subscriptionData)}`)
  }

  const data = getTakeoutPriceInfo(pricingDescription ?? '')

  return {
    subscription,
    ...data,
  }
}
