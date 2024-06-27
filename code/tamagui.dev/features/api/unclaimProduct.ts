import type { User } from '@supabase/supabase-js'
import type Stripe from 'stripe'
import { supabaseAdmin } from '../auth/supabaseAdmin'
import { removeCollaboratorFromRepo } from '../github/helpers'
import type { Database, Json } from '../supabase/types'

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
  if (claimRes.error) throw claimRes.error
  const subscriptionRes = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('id', subscription.id)
    .single()
  if (subscriptionRes.error) throw subscriptionRes.error

  const userId = subscriptionRes.data?.user_id
  const userRes = await supabaseAdmin.auth.admin.getUserById(userId)
  if (userRes.error) throw userRes.error

  const { user } = userRes.data
  for (const claim of claimRes.data) {
    const claimData = claim.data
    if (typeof claimData !== 'object' || !claimData || Array.isArray(claimData)) {
      throw new Error('bad `data` on claim row')
    }

    unclaimRepoAccess({ data: claimData, claim, user })

    await supabaseAdmin.from('claims').update({
      unclaimed_at: Number(new Date()).toString(),
    })
  }
}

type UnclaimFunction = (args: {
  data: {
    [key: string]: Json | undefined
  }
  user: User
  claim: Database['public']['Tables']['claims']['Row']
}) => Promise<void>

const unclaimRepoAccess: UnclaimFunction = async ({ data, user }) => {
  const repoName = data.repository_name || data.repo_name
  if (typeof repoName !== 'string') {
    throw new Error(`repository_name is not set on product metadata or is not correct`)
  }
  const githubId = (data.user_github as any)?.id as number | undefined
  if (!githubId) {
    throw new Error(`user_github.id is not set on product metadata or is not correct`)
  }
  const githubUser = await fetch(`https://api.github.com/user/${githubId}`).then((res) =>
    res.json()
  )
  removeCollaboratorFromRepo(repoName, githubUser.login)
}
