import { getArray } from './getArray'
import { getSingle } from './getSingle'
import { getTakeoutPriceInfo } from '../features/site/purchase/getProductInfo'
import { getActiveSubscriptions } from '~/features/user/helpers'

export async function ensureSubscription(
  userId?: string,
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

  const subscription = await getActiveSubscriptions(userId, subscriptionId)

  if (!subscription) {
    throw Response.json(
      {
        message: 'no subscription with the provided id found that belongs to your user.',
      },
      {
        status: 404,
      }
    )
  }

  const validProducts = ['Tamagui Pro', 'Tamagui Support']

  const subscriptionData = getArray(subscription.subscription_items).find((item) => {
    const products = getSingle(getSingle(item?.price)?.products)
    return products?.name && validProducts.includes(products.name)
  })

  if (!subscriptionData) {
    throw Response.json(
      {
        message: 'the provided subscription does not include the Tamagui Pro',
      },
      {
        status: 401,
      }
    )
  }

  const pricingDescription = getSingle(subscriptionData.price)?.description?.toLowerCase()

  if (!pricingDescription) {
    console.warn(`No price description: ${JSON.stringify(subscriptionData)}`)
  }

  const data = getTakeoutPriceInfo(pricingDescription ?? '')

  return {
    subscription,
    ...data,
  }
}
