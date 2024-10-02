import { redirect } from 'one'
import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { getQuery } from '~/features/api/getQuery'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

// is called after bot is installed
export default apiRoute(async (req) => {
  const { supabase } = await ensureAuth({ req })
  const query = getQuery(req)

  let state: number
  let installationId: number

  // example: installation_id=00000000&setup_action=install&state=foobar
  if (typeof query.installation_id !== 'string') {
    return Response.json({ message: `installation_id is not provided` }, { status: 400 })
  }

  installationId = Number(query.installation_id)
  if (Number.isNaN(installationId)) {
    return Response.json({ message: `installation_id is not a number` }, { status: 400 })
  }

  if (typeof query.state !== 'string') {
    return Response.json({ message: `state is not provided` }, { status: 400 })
  }

  state = Number(query.state)
  if (Number.isNaN(state)) {
    return Response.json({ message: `state is not a number` }, { status: 400 })
  }

  const installation = await supabaseAdmin
    .from('app_installations')
    .select('id, subscription_item_id')
    .eq('id', state)
    .single()

  if (installation.error) {
    return Response.json({ message: 'installation not found' }, { status: 404 })
  }

  // fetch by user's session to see if RLS lets them pass
  const { error: subscriptionItemError } = await supabase
    .from('subscription_items')
    .select('id')
    .eq('id', installation.data?.subscription_item_id || '')
    .single()

  if (subscriptionItemError) {
    return Response.json({ message: 'subscription item not found' }, { status: 404 })
  }

  const { error } = await supabaseAdmin
    .from('app_installations')
    .update({
      github_installation_id: installationId,
      installed_at: new Date() as unknown as string,
    })
    .eq('id', state)
    .select('*')
    .single()

  if (error) {
    throw error
  }

  return redirect(
    `/account/items?${new URLSearchParams({
      github_app_installed: '1',
    })}`
  )
})
