import { getActiveSubscriptions } from '~/features/user/helpers'
import { ProductName } from '~/shared/types/subscription'
import { getTakeoutPriceInfo } from '../features/site/purchase/getProductInfo'
import { getArray } from './getArray'
import { getSingle } from './getSingle'

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

  // This for making sure the subscription is valid for the takeout channel
  // We don't need to check for chat/support subscriptions since they are handled in the support+api.ts file
  const validProducts = [
    // V1 products
    ProductName.TamaguiPro,
    // Add old Takeout Stack to support old subscriptions access to the takeout channel
    ProductName.TamaguiTakeoutStack,
    // V2 products
    ProductName.TamaguiProV2,
    ProductName.TamaguiProV2Upgrade,
    // V2 support tiers also imply Pro access
    ProductName.TamaguiSupportDirect,
    ProductName.TamaguiSupportSponsor,
  ]

  const subscriptionData = getArray(subscription.subscription_items).find((item) => {
    const products = getSingle(getSingle(item?.price)?.products)
    return (
      products?.name &&
      validProducts.includes(products.name as (typeof validProducts)[number])
    )
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

  // Check if this is a V2 Pro subscription (unlimited team, per-project license)
  const productName = getSingle(getSingle(subscriptionData?.price)?.products)?.name
  const isV2Pro =
    productName === ProductName.TamaguiProV2 ||
    productName === ProductName.TamaguiProV2Upgrade ||
    productName === ProductName.TamaguiSupportDirect ||
    productName === ProductName.TamaguiSupportSponsor

  const data = getTakeoutPriceInfo(pricingDescription ?? '', isV2Pro)

  return {
    subscription,
    ...data,
  }
}
