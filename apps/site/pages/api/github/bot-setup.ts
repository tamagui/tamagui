import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextApiHandler } from 'next'

// is called after bot is installed
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
  let state: number
  let installationId: number
  // example: installation_id=00000000&setup_action=install&state=foobar
  if (typeof req.query.installation_id !== 'string') {
    res.status(400).json({ message: `installation_id is not provided` })
    return
  }
  installationId = Number(req.query.installation_id)
  if (isNaN(installationId)) {
    res.status(400).json({ message: `installation_id is not a number` })
  }

  if (typeof req.query.state !== 'string') {
    res.status(400).json({ message: `state is not provided` })
    return
  }
  state = Number(req.query.state)
  if (isNaN(state)) {
    res.status(400).json({ message: `state is not a number` })
  }

  const installation = await supabaseAdmin
    .from('app_installations')
    .select('id, subscription_item_id')
    .eq('id', state).single()

  if (installation.error) {
    res.status(404).json({ message: 'installation not found' })
  }

  // fetch by user's session to see if RLS lets them pass
  const { error: subscriptionItemError } = await supabase
    .from('subscription_items')
    .select('id')
    .eq('id', installation.data?.subscription_item_id)
    .single()

  if (subscriptionItemError) {
    res.status(404).json({ message: 'subscription item not found' })
    return
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

  res.redirect(
    `/account/subscriptions?${new URLSearchParams({
      github_app_installed: '1',
    })}`
  )
}

export default handler
