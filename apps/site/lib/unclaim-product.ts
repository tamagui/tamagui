import { User } from '@supabase/supabase-js'
import { removeCollaboratorFromRepo } from 'protected/_utils/github'
import Stripe from 'stripe'

import { Database, Json } from './supabase-types'
import { supabaseAdmin } from './supabaseAdmin'

/**
 * removes access to previously claimed access
 */
export async function unclaimSubscription(subscription: Stripe.Subscription) {
  // if (typeof data !== 'object' || !data || Array.isArray(data)) {
  //   throw new Error('bad `data` on claim row')
  // }
  const claimRes = await supabaseAdmin
    .from('claims')
    .select('*')
    .eq('subscription_id', subscription.id)
    .single()
  if (claimRes.error) throw claimRes.error

  const claim = claimRes.data
  const subscriptionRes = await supabaseAdmin.from('subscriptions').select('*').single()
  if (subscriptionRes.error) throw subscriptionRes.error

  const userId = subscriptionRes.data?.user_id

  const userRes = await supabaseAdmin.auth.admin.getUserById(userId)
  if (userRes.error) throw userRes.error
  const { user } = userRes.data

  const claimData = claim.data
  if (typeof claimData !== 'object' || !claimData || Array.isArray(claimData)) {
    throw new Error('bad `data` on claim row')
  }

  switch (claimData.claim_type) {
    case 'repo_access':
      unclaimRepoAccess({ data: claimData, claim, user })
      break
    default:
      break
  }
  await supabaseAdmin.from('claims').update({
    unclaimed_at: Number(new Date()).toString(),
  })
}

type UnclaimFunction = (args: {
  data: {
    [key: string]: Json | undefined
  }
  user: User
  claim: Database['public']['Tables']['claims']['Row']
}) => Promise<void>

const unclaimRepoAccess: UnclaimFunction = async ({ data, user }) => {
  if (typeof data.repository_name !== 'string') {
    throw new Error(`repository_name is not set on product metadata or is not correct`)
  }

  const userPrivate = await supabaseAdmin
    .from('users_private')
    .select()
    .eq('id', user.id)
    .single()

  if (userPrivate.error) {
    throw new Error(userPrivate.error.message)
  }

  const userGithubToken = userPrivate.data.github_token

  const githubUser = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${userGithubToken}` },
  }).then((res) => res.json())

  removeCollaboratorFromRepo(data.repository_name, githubUser)
}
