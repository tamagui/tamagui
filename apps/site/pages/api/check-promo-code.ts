import { apiRoute } from '@lib/apiRoute'
import { stripe } from '@lib/stripe'

const handler = apiRoute(async (req, res) => {
  const code = req.query.code

  if (typeof code !== 'string') {
    res.status(400).json({
      message: 'no code provided',
    })
    return
  }

  const promoList = await stripe.promotionCodes.list({
    active: true,
    code,
    expand: ['data.coupon'],
  })

  const promo = promoList.data[0]

  if (!promo || !promo?.coupon) {
    res.status(404).json({
      message: "promo code doesn't exist",
    })
    return
  }
  res.json(promo.coupon)
})
export default handler
