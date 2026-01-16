import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'

export default apiRoute(async (req) => {
  if (req.method === 'GET') {
    return getProjectTeam(req)
  }
  if (req.method === 'POST') {
    return addTeamMember(req)
  }
  if (req.method === 'DELETE') {
    return removeTeamMember(req)
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
})

/**
 * Get team members for a project
 */
const getProjectTeam = async (req: Request) => {
  const { supabase, user } = await ensureAuth({ req })

  const url = new URL(req.url)
  const projectId = url.searchParams.get('project_id')

  if (!projectId) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 })
  }

  // Verify user has access to this project (owner or member)
  const { data: access, error: accessError } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', projectId)
    .single()

  if (accessError || !access) {
    return Response.json({ error: 'Project not found' }, { status: 404 })
  }

  const isOwner = access.user_id === user.id

  if (!isOwner) {
    // Check if user is a team member
    const { data: membership } = await supabase
      .from('project_team_members')
      .select('id')
      .eq('project_id', projectId)
      .eq('user_id', user.id)
      .single()

    if (!membership) {
      return Response.json({ error: 'Access denied' }, { status: 403 })
    }
  }

  // Get team members with user details
  const { data: members, error: membersError } = await supabase
    .from('project_team_members')
    .select(`
      id,
      user_id,
      role,
      invited_at
    `)
    .eq('project_id', projectId)

  if (membersError) {
    console.error('Error fetching team members:', membersError)
    return Response.json({ error: 'Failed to fetch team members' }, { status: 500 })
  }

  // Get user details for members
  const userIds = members?.map((m) => m.user_id) || []
  const { data: users } = await supabase
    .from('users')
    .select('id, full_name, avatar_url')
    .in('id', userIds)

  const membersWithDetails = members?.map((member) => ({
    ...member,
    user: users?.find((u) => u.id === member.user_id) || null,
  }))

  return Response.json({
    members: membersWithDetails,
    isOwner,
  })
}

/**
 * Add a team member to a project (owner only, unlimited in v2)
 */
const addTeamMember = async (req: Request) => {
  const { supabase, user } = await ensureAuth({ req })

  const { project_id, email } = await req.json()

  if (!project_id || !email) {
    return Response.json({ error: 'Project ID and email are required' }, { status: 400 })
  }

  // Verify ownership
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single()

  if (projectError || !project) {
    return Response.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  // Find user by email
  const { data: invitee, error: inviteeError } = await supabase
    .from('users_private')
    .select('id')
    .eq('email', email)
    .single()

  if (inviteeError || !invitee) {
    return Response.json(
      {
        error: 'User not found. They need to create an account first.',
      },
      { status: 404 }
    )
  }

  // Check if already a member
  const { data: existing } = await supabase
    .from('project_team_members')
    .select('id')
    .eq('project_id', project_id)
    .eq('user_id', invitee.id)
    .single()

  if (existing) {
    return Response.json({ error: 'User is already a team member' }, { status: 409 })
  }

  // Add team member (no seat limit in v2)
  const { data: member, error: memberError } = await supabase
    .from('project_team_members')
    .insert({
      project_id,
      user_id: invitee.id,
      role: 'member',
    })
    .select()
    .single()

  if (memberError) {
    console.error('Error adding team member:', memberError)
    return Response.json({ error: 'Failed to add team member' }, { status: 500 })
  }

  return Response.json({ member })
}

/**
 * Remove a team member from a project (owner only)
 */
const removeTeamMember = async (req: Request) => {
  const { supabase, user } = await ensureAuth({ req })

  const { project_id, member_id } = await req.json()

  if (!project_id || !member_id) {
    return Response.json(
      { error: 'Project ID and member ID are required' },
      { status: 400 }
    )
  }

  // Verify ownership
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, user_id')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single()

  if (projectError || !project) {
    return Response.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  // Cannot remove owner
  if (member_id === user.id) {
    return Response.json({ error: 'Cannot remove project owner' }, { status: 400 })
  }

  const { error: deleteError } = await supabase
    .from('project_team_members')
    .delete()
    .eq('project_id', project_id)
    .eq('user_id', member_id)

  if (deleteError) {
    console.error('Error removing team member:', deleteError)
    return Response.json({ error: 'Failed to remove team member' }, { status: 500 })
  }

  return Response.json({ success: true })
}
