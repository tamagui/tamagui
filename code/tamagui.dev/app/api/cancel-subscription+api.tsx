import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { supabase, user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subId = body['subscription_id']
  if (!subId || typeof subId !== 'string') {
    return Response.json(
      { error: 'subscription_id is required and must be a string' },
      { status: 400 }
    )
  }

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('id, status')
    .eq('id', subId)
    .eq('user_id', user.id)
    .single()

  if (error || !subscription) {
    return Response.json(
      { error: 'Subscription not found or unauthorized' },
      { status: 404 }
    )
  }

  try {
    const updatedSubscription = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    })

    await supabase
      .from('subscriptions')
      .update({
        cancel_at_period_end: true,
        canceled_at: new Date().toISOString(),
      })
      .eq('id', subId)

    return Response.json({
      message: 'Subscription will be canceled at the end of the billing period',
      subscription: updatedSubscription,
    })
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return Response.json({ error: error.message }, { status: error.statusCode || 500 })
    }
    console.error('Error canceling subscription:', error)
    return Response.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
})
