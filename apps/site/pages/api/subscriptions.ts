import { stripe } from '@lib/stripe'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'
import Stripe from 'stripe'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    return res.status(401).json({
      error: 'You are not authenticated',
    })
  }

  try {
    const customerResult = await supabaseAdmin
      .from('customers')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    if (customerResult.error) {
      throw new Error(customerResult.error.message)
    }
    if (!customerResult.data) {
      res.status(200).json([])
      return
    }
    const customer = customerResult.data

    if (!customer.stripe_customer_id) {
      throw new Error(`No stripe id associated with user ${user.id}`)
    }
    const subscriptions = await stripe.subscriptions.list({
      customer: customer.stripe_customer_id,
    })

    res.status(200).json(subscriptions.data)
  } catch (error) {
    if (error instanceof Stripe.errors.StripeInvalidRequestError) {
      if (error.code === 'resource_missing') {
        // stripe customer doesn't exist (yet) - we just return an empty array
        res.status(200).json([])
      }
    }
  }
}

export default handler
