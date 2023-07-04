import { Database } from '@lib/supabase-types'
import { supabaseAdmin } from '@lib/supabaseAdmin'
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
}

export default handler
