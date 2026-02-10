import Stripe from 'stripe'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })
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

  // use supabaseAdmin to bypass RLS - server-side client doesn't have proper session for RLS
  const { data: subData } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('id', subId)
    .single()

  if (!subData || subData.user_id !== user.id) {
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
