import type { Endpoint } from 'one'
import { ensureAccess } from '~/features/api/ensureAccess'
import { ensureAuth } from '~/features/api/ensureAuth'

export const GET: Endpoint = async (req) => {
  try {
    const { user } = await ensureAuth({ req })

    const { hasPro } = await ensureAccess({ user })
    if (!hasPro) {
      return Response.json({ error: 'Must have Pro account' }, { status: 403 })
    }

    // return the user info for the CLI (token already validated by ensureAuth)
    const { data, error } = {
      data: {
        session: {
          access_token: req.headers.get('authorization')?.replace('Bearer ', ''),
        },
      },
      error: null,
    }

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
