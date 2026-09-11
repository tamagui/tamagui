import type { Endpoint } from 'one'
import { getBentoBundleZip } from '~/features/auth/supabaseAdmin'

export const GET: Endpoint = async () => {
  try {
    const zipFile = await getBentoBundleZip()
    return new Response(zipFile, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=bento-bundle.zip',
      },
    })
  } catch (error) {
    console.error('Error getting Bento bundle:', error)
    return Response.json({ error: 'Failed to get Bento bundle' }, { status: 500 })
  }
}
