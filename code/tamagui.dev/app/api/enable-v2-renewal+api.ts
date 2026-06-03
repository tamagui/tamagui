import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'
import { V1_PRODUCTS } from '~/features/stripe/products'

/**
 * Legacy endpoint kept so old links and clients still resolve cleanly.
 * Pre-V2 renewals now get 30% off automatically, so no mutation is needed.
 */
export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)
  const subscriptionId = body['subscription_id']

  if (!subscriptionId || typeof subscriptionId !== 'string') {
    return Response.json({ error: 'subscription_id is required' }, { status: 400 })
  }

  // must start with sub_
  if (!subscriptionId.startsWith('sub_')) {
    return Response.json({ error: 'Invalid subscription_id format' }, { status: 400 })
  }

  try {
    // verify user owns this subscription
    const { data: subData } = await supabaseAdmin
      .from('subscriptions')
      .select('user_id')
      .eq('id', subscriptionId)
      .single()

    if (!subData || subData.user_id !== user.id) {
      return Response.json(
        { error: 'Subscription not found or not owned by this user' },
        { status: 404 }
      )
    }

    // get subscription from Stripe to verify it exists and get details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })

    if (!subscription) {
      return Response.json({ error: 'Subscription not found' }, { status: 404 })
    }

    // verify it's a V1 subscription
    const isV1 = subscription.items.data.some((item) => {
      const product = item.price?.product
      const productId = typeof product === 'string' ? product : product?.id
      return productId && V1_PRODUCTS.includes(productId as any)
    })

    if (!isV1) {
      return Response.json(
        {
          error:
            'This discount notice only applies to pre-v2 subscriptions and is automatic when they renew.',
        },
        { status: 400 }
      )
    }

    return Response.json({
      success: true,
      automatic: true,
      message:
        'Pre-v2 renewals now get 30% off automatically. No action is needed for this subscription.',
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error checking renewal discount eligibility:', error.message)
      return Response.json({ error: error.message }, { status: 500 })
    }
    throw error
  }
})
