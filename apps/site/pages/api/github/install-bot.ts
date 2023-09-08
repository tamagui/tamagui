import { apiRoute } from '@lib/apiRoute'
import { protectApiRoute } from '@lib/protectApiRoute'
import { supabaseAdmin } from '@lib/supabaseAdmin'

export default apiRoute(async (req, res) => {
  await protectApiRoute({ req, res })

  if (typeof req.query.subscription_item_id !== 'string') {
    res.status(400).json({ message: `subscription_item_id is not provided` })
    return
  }

  const subscriptionItemId = req.query.subscription_item_id

  const { data } = await supabaseAdmin
    .from('app_installations')
    .insert({ subscription_item_id: subscriptionItemId })
    .select('*')
    .single()

  if (data?.id) {
    res.redirect(`https://github.com/apps/tamaguibot/installations/new?state=${data.id}`)
  }
})
