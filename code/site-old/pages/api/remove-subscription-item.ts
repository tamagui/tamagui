import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import { stripe } from '@lib/stripe'

export default apiRoute(async (req, res) => {
  const { supabase } = await protectApiRoute({ req, res })

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
    console.error(error)
    res.status(404).json({
      message: 'no subscription item found with the provided id that belongs to you',
    })
  }

  const { deleted } = await stripe.subscriptionItems.del(subItemId)
  if (deleted) {
    res.json({ message: 'deleted successfully' })
  }
})
