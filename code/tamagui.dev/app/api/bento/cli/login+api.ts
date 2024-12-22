import type { Endpoint } from 'one'
import { ensureAuth } from '~/features/api/ensureAuth'
import { ensureAccess } from '~/features/api/ensureAccess'
import { getSupabaseServerClient } from '~/features/api/getSupabaseServerClient'

export const GET: Endpoint = async (req) => {
  try {
    // Ensure the user is authenticated
    const { supabase, user } = await ensureAuth({ req })

    // Check if the user has access to Bento
    await ensureAccess({
      req,
      supabase,
      checkForBentoAccess: true,
    })

    // Create a new session for the CLI
    const { data, error } = await supabase.auth.refreshSession()

    if (error) {
      throw error
    }

    // Return the new access token as JSON
    return new Response(
      JSON.stringify({
        success: true,
        accessToken: data.session?.access_token,
      })
    )
  } catch (error) {
    console.error('CLI login error:', error)
    return Response.json(
      {
        success: false,
        error: 'Authentication failed or no access to Bento',
      },
      { status: 401 }
    )
  }
}
