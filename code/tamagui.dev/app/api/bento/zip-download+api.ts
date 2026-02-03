import type { Endpoint } from 'one'
import { ensureAuth } from '~/features/api/ensureAuth'
import { hasProAccess } from '~/features/bento/hasProAccess'
import { getBentoBundleZip } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async (req) => {
  const { user } = await ensureAuth({ req })

  if (!user) {
    return Response.json({ error: 'not_authenticated' }, { status: 401 })
  }

  const hasPro = await hasProAccess(user.id)
  if (!hasPro) {
    return Response.json({ error: 'not_authorized' }, { status: 401 })
  }

  try {
    const zipFile = await getBentoBundleZip()

    // Set appropriate headers for ZIP file download
    const headers = new Headers()
    headers.set('Content-Type', 'application/zip')
    headers.set('Content-Disposition', 'attachment; filename=bento-bundle.zip')

    return new Response(zipFile, { headers })
  } catch (error) {
    console.error('Error getting Bento bundle:', error)
    return Response.json({ error: 'Failed to get Bento bundle' }, { status: 500 })
  }
}
