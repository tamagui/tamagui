import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  const url = new URL(req.url)
  const subscriptionItemId = url.searchParams.get('subscription_item_id')

  if (typeof subscriptionItemId !== 'string') {
    return Response.json(
      { message: `subscription_item_id is not provided` },
      {
        status: 400,
      }
    )
  }

  // verify the caller owns this subscription item via its subscription before
  // inserting an installation row for it (mirrors github/bot-setup)
  const { data: subItem } = await supabaseAdmin
    .from('subscription_items')
    .select('subscription_id')
    .eq('id', subscriptionItemId)
    .single()

  if (!subItem) {
    return Response.json({ message: 'subscription item not found' }, { status: 404 })
  }

  const { data: sub } = await supabaseAdmin
    .from('subscriptions')
    .select('user_id')
    .eq('id', subItem.subscription_id)
    .single()

  if (!sub || sub.user_id !== user.id) {
    return Response.json({ message: 'subscription item not found' }, { status: 404 })
  }

  const { data } = await supabaseAdmin
    .from('app_installations')
    .insert({ subscription_item_id: subscriptionItemId })
    .select('*')
    .single()

  if (data?.id) {
    return Response.redirect(
      `https://github.com/apps/tamaguibot/installations/new?state=${data.id}`
    )
  }

  return new Response('Failed to create installation', { status: 500 })
})
