import { protectApiRoute } from '@lib/protectApiRoute'
import { stripe } from '@lib/stripe'
import type { NextApiHandler } from 'next'
import Stripe from 'stripe'

const handler: NextApiHandler = async (req, res) => {
  const { supabase } = await protectApiRoute({ req, res })

  const subId = req.body['subscription_id']
  if (typeof subId === 'undefined') {
    res.status(400).json({
      error: 'subscription_id is required',
    })
  }
  if (typeof subId !== 'string') {
    res.status(400).json({
      error: 'Invalid subscription_id',
    })
    return
  }

  const { error } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('id', subId)
    .single()
  if (error) {
    console.error(error)
    res
      .status(404)
      .json({ message: 'no subscription found with the provided id that belongs to you' })
  }
  try {
    const data = await stripe.subscriptions.update(subId, {
      cancel_at_period_end: true,
    })
    if (data) {
      res.json({
        message: 'The subscription will be canceled at the end of the current period.',
      })
    }
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      res.status(error.statusCode || 500).json({ message: error.message })
    }
  }
}

export default handler
