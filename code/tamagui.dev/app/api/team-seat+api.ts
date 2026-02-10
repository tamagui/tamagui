import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'
import { stripe } from '~/features/stripe/stripe'
import type Stripe from 'stripe'
import { STRIPE_PRODUCTS } from '~/features/stripe/products'

export default apiRoute(async (req) => {
  if (req.method === 'GET') {
    return getTeamSeats(req)
  }
  if (req.method === 'POST') {
    return inviteTeamMember(req)
  }
  if (req.method === 'DELETE') {
    return removeTeamMember(req)
  }
})

const getTeamSeats = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  // Get team subscription for the user
  const { data: teamSubscription, error: subscriptionError } = await supabaseAdmin
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

  // Calculate used seats from active team members
  const activeMembers = teamSubscription.team_members.filter(
    (member) => member.status === 'active'
  )
  const used_seats = activeMembers.length

  // Get member details for each team member
  const memberIds = activeMembers.map((member) => member.member_id)

  const { data: memberDetails, error: memberError } = await supabaseAdmin
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
      used_seats,
      created_at: teamSubscription.created_at,
      expires_at: teamSubscription.expires_at,
      status: teamSubscription.status,
      stripe_subscription_id: teamSubscription.stripe_subscription_id,
    },
    members: membersWithDetails,
  })
}

const inviteTeamMember = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  const { user_id, team_subscription_id } = await req.json()

  // verify user owns this team subscription
  const { data: teamSub } = await supabaseAdmin
    .from('team_subscriptions')
    .select('id')
    .eq('id', team_subscription_id)
    .eq('owner_id', user.id)
    .single()

  if (!teamSub) {
    return Response.json(
      { error: 'Team subscription not found or access denied' },
      { status: 403 }
    )
  }

  const { data: teamMember, error: teamMemberError } = await supabaseAdmin
    .from('team_members')
    .insert({
      member_id: user_id,
      team_subscription_id,
      status: 'active',
    })
    .select()
    .single()

  if (teamMemberError) {
    return Response.json({ error: 'Failed to invite team member' }, { status: 500 })
  }

  return Response.json({
    message: 'Team member invited successfully',
    team_member: teamMember,
  })
}

const removeTeamMember = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  const { team_member_id, team_subscription_id } = await req.json()

  // verify user owns this team subscription
  const { data: teamSub } = await supabaseAdmin
    .from('team_subscriptions')
    .select('id')
    .eq('id', team_subscription_id)
    .eq('owner_id', user.id)
    .single()

  if (!teamSub) {
    return Response.json(
      { error: 'Team subscription not found or access denied' },
      { status: 403 }
    )
  }

  const { data: teamMember, error: teamMemberError } = await supabaseAdmin
    .from('team_members')
    .delete()
    .eq('member_id', team_member_id)
    .eq('team_subscription_id', team_subscription_id)

  if (teamMemberError) {
    return Response.json({ error: 'Failed to remove team member' }, { status: 500 })
  }

  return Response.json({ message: 'Team member removed successfully' })
}
