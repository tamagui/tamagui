import { apiRoute } from '~/features/api/apiRoute'
import { ensureAuth } from '~/features/api/ensureAuth'
import { isAdminEmail } from '~/features/api/isAdmin'
import { readBodyJSON } from '~/features/api/readBodyJSON'
import { supabaseAdmin } from '~/features/auth/supabaseAdmin'

/**
 * Generate impersonation link for admin to view a user's account
 * Admin-only endpoint
 *
 * POST /api/admin/impersonate
 * Body: { userId: string } OR { email: string }
 *
 * Returns an HTML page that uses the magic link to sign in as the user
 */
export default apiRoute(async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 })
  }

  const { user } = await ensureAuth({ req })

  // check admin access
  if (!isAdminEmail(user.email)) {
    return Response.json({ error: 'Admin access required' }, { status: 403 })
  }

  const body = await readBodyJSON(req)
  const targetUserId = body['userId']
  const targetEmail = body['email']

  if (!targetUserId && !targetEmail) {
    return Response.json({ error: 'userId or email is required' }, { status: 400 })
  }

  try {
    // find user by ID or email
    let targetUser: { id: string; email: string | null } | null = null

    if (targetUserId) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('id', targetUserId)
        .single()
      targetUser = data
    } else if (targetEmail) {
      const { data } = await supabaseAdmin
        .from('users')
        .select('id, email')
        .eq('email', targetEmail)
        .single()
      targetUser = data
    }

    if (!targetUser || !targetUser.email) {
      return Response.json({ error: 'User not found or has no email' }, { status: 404 })
    }

    // generate a magic link for the user
    const { data: linkData, error: linkError } =
      await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: targetUser.email,
      })

    if (linkError || !linkData) {
      console.error('Failed to generate magic link:', linkError)
      return Response.json(
        { error: 'Failed to generate impersonation link' },
        { status: 500 }
      )
    }

    // extract the token from the magic link properties
    const token = linkData.properties?.hashed_token
    if (!token) {
      console.error('No token in magic link response:', linkData)
      return Response.json({ error: 'Failed to get magic link token' }, { status: 500 })
    }

    // return an HTML page that verifies the token and redirects
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Impersonating user...</title>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
</head>
<body>
  <p>Impersonating user ${targetUser.email}...</p>
  <p style="color: red; font-weight: bold;">ADMIN IMPERSONATION MODE</p>
  <p id="status">Verifying...</p>
  <script>
    (async () => {
      const statusEl = document.getElementById('status');
      try {
        const supabase = window.supabase.createClient(
          '${process.env.NEXT_PUBLIC_SUPABASE_URL}',
          '${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}'
        );

        // verify the OTP token
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: '${token}',
          type: 'magiclink'
        });

        if (error) {
          statusEl.textContent = 'Error: ' + error.message;
          console.error('OTP verification failed:', error);
          return;
        }

        if (data.session) {
          localStorage.setItem('sb-auth-token', JSON.stringify(data.session));
          localStorage.setItem('admin-impersonating', 'true');
          statusEl.textContent = 'Success! Redirecting...';
          window.location.href = '/account';
        } else {
          statusEl.textContent = 'No session returned';
        }
      } catch (err) {
        statusEl.textContent = 'Error: ' + err.message;
        console.error('Impersonation error:', err);
      }
    })();
  </script>
</body>
</html>`

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error impersonating user:', error)
    return Response.json({ error: 'Failed to impersonate user' }, { status: 500 })
  }
})
