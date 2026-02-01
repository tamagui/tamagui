import { apiRoute } from '~/features/api/apiRoute'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'
import { stripe } from '~/features/stripe/stripe'

// V2 product ID that coupons must support
const V2_PRODUCT_ID = STRIPE_PRODUCTS.PRO_V2_LICENSE.productId

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { code } = await req.json()

  if (!code) {
    return Response.json({ error: 'Coupon code is required' }, { status: 400 })
  }

  try {
    const promotionCodes = await stripe.promotionCodes.list({
      code,
      active: true,
      limit: 1,
    })

    if (promotionCodes.data.length === 0) {
      return Response.json({
        valid: false,
        message: 'Invalid coupon code',
      })
    }

    const promoCode = promotionCodes.data[0]
    const coupon = await stripe.coupons.retrieve(promoCode.coupon.id)

    if (!coupon.valid) {
      return Response.json({
        valid: false,
        message: 'This coupon is no longer valid',
      })
    }

    if (
      promoCode.max_redemptions &&
      promoCode.times_redeemed >= promoCode.max_redemptions
    ) {
      return Response.json({
        valid: false,
        message: 'This coupon has reached its usage limit',
      })
    }

    if (coupon.redeem_by && coupon.redeem_by < Math.floor(Date.now() / 1000)) {
      return Response.json({
        valid: false,
        message: 'This coupon has expired',
      })
    }

    // check if coupon has product restrictions that exclude V2
    // applies_to.products is set by services like Parity Deals
    if (coupon.applies_to?.products && coupon.applies_to.products.length > 0) {
      const appliesToV2 = coupon.applies_to.products.includes(V2_PRODUCT_ID)
      if (!appliesToV2) {
        return Response.json({
          valid: false,
          message:
            'This coupon is not valid for Pro V2. Please contact support@tamagui.dev for assistance.',
        })
      }
    }

    return Response.json({
      valid: true,
      coupon: {
        code: promoCode.code,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        id: coupon.id,
      },
    })
  } catch (error) {
    console.error('Error validating coupon:', error)
    return Response.json({ error: 'Failed to validate coupon' }, { status: 500 })
  }
})
