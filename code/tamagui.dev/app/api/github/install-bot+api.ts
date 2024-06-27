import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  await ensureAuth({ req })

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

  return Response.error()
})
