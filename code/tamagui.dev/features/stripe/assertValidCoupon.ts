import { ClientError } from '../api/ClientError'
import { stripe } from './stripe'

/**
 * validate a client-supplied coupon id before applying it to a charge.
 * throws with a user-facing message when the coupon is missing, invalid,
 * expired, over its redemption limit, or restricted to other products.
 *
 * this is the server-side gate so a harvested coupon id (the validate-coupon
 * endpoint and stripe both expose ids) can't be applied to a product it was
 * never meant for, or after it has expired / hit its cap.
 */
export async function assertValidCoupon(couponId: string, productId: string) {
  let coupon: Awaited<ReturnType<typeof stripe.coupons.retrieve>>
  try {
    coupon = await stripe.coupons.retrieve(couponId)
  } catch {
    throw new ClientError('Invalid coupon code')
  }

  if (!coupon.valid) {
    throw new ClientError('This coupon is no longer valid')
  }

  if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
    throw new ClientError('This coupon has expired')
  }

  if (coupon.max_redemptions != null && coupon.times_redeemed >= coupon.max_redemptions) {
    throw new ClientError('This coupon has reached its usage limit')
  }

  // if the coupon is restricted to specific products, the charged product must be one of them
  const restrictedProducts = coupon.applies_to?.products
  if (restrictedProducts?.length && !restrictedProducts.includes(productId)) {
    throw new ClientError('This coupon is not valid for this product')
  }
}
