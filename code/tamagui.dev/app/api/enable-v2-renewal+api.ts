import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { sendV2RenewalEnabledEmail } from '~/features/email/helpers'
import { stripe } from '~/features/stripe/stripe'
import { V1_PRODUCTS } from '~/features/stripe/products'

/**
 * Enable V2 renewal for a V1 subscription
 * Requires authentication - user must own the subscription
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

    // check if already enabled
    if (subscription.metadata?.v2_renewal_enabled === 'true') {
      return Response.json({
        success: true,
        message: 'V2 renewal is already enabled for this subscription',
        alreadyEnabled: true,
      })
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
          error: 'This is not a V1 subscription. V2 renewal is only for V1 subscribers.',
        },
        { status: 400 }
      )
    }

    // update Stripe subscription metadata
    await stripe.subscriptions.update(subscriptionId, {
      metadata: {
        ...subscription.metadata,
        v2_renewal_enabled: 'true',
        v2_renewal_enabled_at: new Date().toISOString(),
      },
    })

    // get user info to send confirmation email
    const { data: userData } = await supabaseAdmin
      .from('users')
      .select('email, full_name')
      .eq('id', user.id)
      .single()

    if (userData?.email) {
      // send confirmation email
      await sendV2RenewalEnabledEmail(userData.email, {
        name: userData.full_name || 'there',
      })
    }

    return Response.json({
      success: true,
      message:
        'V2 renewal enabled! When your V1 subscription renews, you will automatically get Takeout 2 with 35% off.',
    })
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      console.error('Stripe error enabling V2 renewal:', error.message)
      return Response.json({ error: error.message }, { status: error.statusCode || 500 })
    }
    throw error
  }
})
