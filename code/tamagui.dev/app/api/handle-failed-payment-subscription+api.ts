import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { stripe } from '~/features/stripe/stripe'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { readBodyJSON } from '~/features/api/readBodyJSON'

export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subscriptionId = body['subscriptionId']

  if (!subscriptionId) {
    return Response.json({ error: 'Subscription ID is required' }, { status: 400 })
  }

  try {
    // Retrieve the subscription to verify it belongs to the user
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    if (subscription.status === 'canceled') {
      return Response.json({ error: 'Subscription already canceled' }, { status: 400 })
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(subscriptionId, {
      prorate: true,
    })

    // Update subscription status in Supabase
    const { error: updateError } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        ended_at: new Date().toISOString(),
      })
      .eq('id', subscriptionId)

    if (updateError) {
      console.error('Error updating subscription in Supabase:', updateError)
      // Even if Supabase update fails, we don't want to revert the Stripe cancellation
      // Just log the error and return success with a warning
      return Response.json({
        success: true,
        warning: 'Subscription cancelled in Stripe but database update failed',
      })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return Response.json({ error: 'Failed to cancel subscription' }, { status: 500 })
  }
})
