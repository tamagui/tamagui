import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { isAdminEmail } from '~/features/api/isAdmin'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

/**
 * Admin-only endpoint for managing pro whitelist
 *
 * GET /api/admin/whitelist - list all whitelisted users
 * POST /api/admin/whitelist - add user to whitelist
 * DELETE /api/admin/whitelist - remove user from whitelist
 */
export default apiRoute(async (req) => {
  const { user } = await ensureAuth({ req })

  // security: admin access required
  if (!isAdminEmail(user.email)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  if (req.method === 'GET') {
    return handleGet()
  }

  if (req.method === 'POST') {
    return handlePost(req, user.id)
  }

  if (req.method === 'DELETE') {
    return handleDelete(req)
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 })
})

async function handleGet() {
  const { data, error } = await supabaseAdmin
    .from('pro_whitelist')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching whitelist:', error)
    return Response.json({ error: 'Failed to fetch whitelist' }, { status: 500 })
  }

  return Response.json({ whitelist: data })
}

async function handlePost(req: Request, adminUserId: string) {
  const body = await readBodyJSON(req)
  const githubUsername = body['github_username']?.trim()
  const note = body['note']?.trim() || null

  if (!githubUsername || typeof githubUsername !== 'string') {
    return Response.json({ error: 'github_username is required' }, { status: 400 })
  }

  // validate github username format (alphanumeric + hyphens, 1-39 chars)
  if (!/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(githubUsername)) {
    return Response.json({ error: 'Invalid GitHub username format' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('pro_whitelist')
    .insert({
      github_username: githubUsername,
      note,
      created_by: adminUserId,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // unique constraint violation
      return Response.json({ error: 'User already whitelisted' }, { status: 409 })
    }
    console.error('Error adding to whitelist:', error)
    return Response.json({ error: 'Failed to add to whitelist' }, { status: 500 })
  }

  return Response.json({ entry: data }, { status: 201 })
}

async function handleDelete(req: Request) {
  const body = await readBodyJSON(req)
  const id = body['id']
  const githubUsername = body['github_username']

  if (!id && !githubUsername) {
    return Response.json({ error: 'id or github_username is required' }, { status: 400 })
  }

  let query = supabaseAdmin.from('pro_whitelist').delete()

  if (id) {
    query = query.eq('id', id)
  } else if (githubUsername) {
    query = query.ilike('github_username', githubUsername)
  }

  const { error, count } = await query

  if (error) {
    console.error('Error removing from whitelist:', error)
    return Response.json({ error: 'Failed to remove from whitelist' }, { status: 500 })
  }

  return Response.json({ success: true, deleted: count ?? 0 })
}
