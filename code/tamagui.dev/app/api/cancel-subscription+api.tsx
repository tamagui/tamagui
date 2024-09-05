import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  const { supabase } = await ensureAuth({ req })
  const body = await readBodyJSON(req)

  const subId = body['subscription_id']
  if (typeof subId === 'undefined') {
    return Response.json(
      {
        error: 'subscription_id is required',
      },
      {
        status: 400,
      }
    )
  }

  if (typeof subId !== 'string') {
    return Response.json(
      {
        error: 'Invalid subscription_id',
      },
      {
        status: 400,
      }
    )
  }

  const { error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('id', subId)
    .single()

  if (error) {
    console.error(error)
    return Response.json(
      { message: 'no subscription found with the provided id that belongs to you' },
      {
        status: 404,
      }
    )
  }

  try {
    const data = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    })
    if (data) {
      return Response.json({ message: 'The subscription is cancelled.' })
    }
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      return Response.json(
        { message: error.message },
        {
          status: error.statusCode || 500,
        }
      )
    }
    throw error
  }
})
