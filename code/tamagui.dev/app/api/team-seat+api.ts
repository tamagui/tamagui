import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { createOrRetrieveCustomer } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'
import type Stripe from 'stripe'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

export default apiRoute(async (req) => {
  if (req.method === 'GET') {
    return getTeamSeats(req)
  }
})

const getTeamSeats = async (req: Request) => {
  const { supabase, user } = await ensureAuth({ req })

  // Get team subscription for the user
  const { data: teamSubscription, error: subscriptionError } = await supabase
    .from('team_subscriptions')
    .select(`
      *,
      team_members(*)
    `)
    .eq('owner_id', user.id)
    .single()

  if (subscriptionError) {
    return Response.json({ error: 'Failed to fetch team subscription' }, { status: 500 })
  }

  if (!teamSubscription) {
    return Response.json({ error: 'No team subscription found' }, { status: 404 })
  }

  // Get member details for each team member
  const memberIds = teamSubscription.team_members
    .filter((member) => member.status === 'active')
    .map((member) => member.member_id)

  const { data: memberDetails, error: memberError } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .in('id', memberIds)

  if (memberError) {
    return Response.json({ error: 'Failed to fetch member details' }, { status: 500 })
  }

  // Combine member details with team members
  const membersWithDetails = teamSubscription.team_members.map((member) => {
    const details = memberDetails?.find((detail) => detail.id === member.member_id)
    return {
      ...member,
      user: details || null,
    }
  })

  return Response.json({
    subscription: {
      id: teamSubscription.id,
      total_seats: teamSubscription.total_seats,
      used_seats: teamSubscription.used_seats,
      created_at: teamSubscription.created_at,
      expires_at: teamSubscription.expires_at,
      status: teamSubscription.status,
      stripe_subscription_id: teamSubscription.stripe_subscription_id,
    },
    members: membersWithDetails,
  })
}
