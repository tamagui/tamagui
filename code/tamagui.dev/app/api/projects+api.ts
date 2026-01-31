import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

export default apiRoute(async (req) => {
  if (req.method === 'GET') {
    return getProjects(req)
  }
  if (req.method === 'POST') {
    return createProject(req)
  }
  if (req.method === 'PUT') {
    return updateProject(req)
  }
  return Response.json({ error: 'Method not allowed' }, { status: 405 })
})

/**
 * Get all projects for the authenticated user (owned + team member)
 * Uses admin client to bypass RLS policy recursion issue
 */
const getProjects = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  // Get projects owned by user (using admin to bypass RLS recursion)
  const { data: ownedProjects, error: ownedError } = await supabaseAdmin
    .from('projects')
    .select(`
      *,
      project_team_members(
        id,
        user_id,
        role,
        invited_at
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (ownedError) {
    console.error('Error fetching owned projects:', ownedError)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  // Get project IDs where user is a team member (but not owner)
  const { data: memberships, error: memberError } = await supabaseAdmin
    .from('project_team_members')
    .select('project_id')
    .eq('user_id', user.id)

  if (memberError) {
    console.error('Error fetching member projects:', memberError)
    return Response.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }

  // Get those projects (excluding owned ones)
  const memberProjectIds = memberships?.map((m) => m.project_id) || []
  const ownedProjectIds = ownedProjects?.map((p) => p.id) || []
  const nonOwnedProjectIds = memberProjectIds.filter(
    (id) => !ownedProjectIds.includes(id)
  )

  let memberProjectsList: typeof ownedProjects = []
  if (nonOwnedProjectIds.length > 0) {
    const { data: memberProjectsData } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        project_team_members(
          id,
          user_id,
          role,
          invited_at
        )
      `)
      .in('id', nonOwnedProjectIds)
      .order('created_at', { ascending: false })

    memberProjectsList = memberProjectsData || []
  }

  return Response.json({
    owned: ownedProjects || [],
    member: memberProjectsList,
  })
}

/**
 * Create a new project (called after successful v2 purchase)
 * Uses admin client to bypass RLS policy recursion issue
 */
const createProject = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  const { name, domain } = await req.json()

  // Basic validation (loose as requested)
  if (!name || name.length <= 2) {
    return Response.json(
      { error: 'Project name must be more than 2 characters' },
      { status: 400 }
    )
  }

  if (!domain || domain.length <= 2) {
    return Response.json(
      { error: 'Domain must be more than 2 characters' },
      { status: 400 }
    )
  }

  // Calculate dates
  const now = new Date()
  const updatesExpireAt = new Date()
  updatesExpireAt.setFullYear(updatesExpireAt.getFullYear() + 1)

  const { data: project, error: projectError } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: user.id,
      name,
      domain,
      license_purchased_at: now.toISOString(),
      updates_expire_at: updatesExpireAt.toISOString(),
    })
    .select()
    .single()

  if (projectError) {
    console.error('Error creating project:', projectError)
    if (projectError.code === '23505') {
      return Response.json(
        { error: 'This domain is already registered to a project' },
        { status: 409 }
      )
    }
    return Response.json({ error: 'Failed to create project' }, { status: 500 })
  }

  // Add owner as team member
  await supabaseAdmin.from('project_team_members').insert({
    project_id: project.id,
    user_id: user.id,
    role: 'owner',
  })

  return Response.json({ project })
}

/**
 * Update a project's name or domain
 * Uses admin client to bypass RLS policy recursion issue
 */
const updateProject = async (req: Request) => {
  const { user } = await ensureAuth({ req })

  const { project_id, name, domain } = await req.json()

  if (!project_id) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 })
  }

  // Verify ownership and get current domain for history tracking
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('projects')
    .select('id, domain')
    .eq('id', project_id)
    .eq('user_id', user.id)
    .single()

  if (existingError || !existing) {
    return Response.json({ error: 'Project not found or access denied' }, { status: 404 })
  }

  const updates: Record<string, string> = {}
  if (name && name.length > 2) updates.name = name
  if (domain && domain.length > 2) updates.domain = domain

  if (Object.keys(updates).length === 0) {
    return Response.json({ error: 'No valid updates provided' }, { status: 400 })
  }

  // If domain is changing, record it in history
  if (updates.domain && existing.domain && updates.domain !== existing.domain) {
    await supabaseAdmin.from('project_domain_history').insert({
      project_id,
      domain: existing.domain,
      changed_by: user.id,
    })
  }

  const { data: project, error: updateError } = await supabaseAdmin
    .from('projects')
    .update(updates)
    .eq('id', project_id)
    .select()
    .single()

  if (updateError) {
    console.error('Error updating project:', updateError)
    if (updateError.code === '23505') {
      return Response.json(
        { error: 'This domain is already registered to another project' },
        { status: 409 }
      )
    }
    return Response.json({ error: 'Failed to update project' }, { status: 500 })
  }

  return Response.json({ project })
}
