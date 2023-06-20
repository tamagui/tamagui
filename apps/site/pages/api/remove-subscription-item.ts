import { stripe } from '@lib/stripe'
import { Database } from '@lib/supabase-types'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  const supabase = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()
  const user = session?.user

  if (!user) {
    res.status(401).json({
      error: 'The user is not authenticated',
    })
    return
  }
  const subItemId = req.body['subscription_item_id']
  if (typeof subItemId === 'undefined') {
    res.status(400).json({
      error: 'subscription_item_id is required',
    })
  }
  if (typeof subItemId !== 'string') {
    res.status(400).json({
      error: 'Invalid subscription_item_id',
    })
    return
  }
  const { error } = await supabase
    .from('subscription_items')
    .select('id')
    .eq('id', subItemId)
    .single()
  if (error) {
    console.log(error)
    res
      .status(404)
      .json({ message: 'no subscription item found with the provided id that belongs to you' })
  }

  const { deleted } = await stripe.subscriptionItems.del(subItemId)
  if (deleted) {
    res.json({ message: 'deleted successfully' })
  }
}

export default handler
