import { AuthClient } from '@supabase/auth-js'

// this module exists only to keep @supabase/auth-js (and the webauthn helper it
// pulls in, ~97kb together) out of the initial payload. import it dynamically
// through getAuthClient in ./useSupabaseClient, never statically.

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export function createAuthClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.error(`Missing supabase info`)
    return null
  }

  return {
    auth: new AuthClient({
      url: `${SUPABASE_URL}/auth/v1`,
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      storageKey: 'sb-auth-token',
      storage: window.localStorage,
      flowType: 'pkce',
      detectSessionInUrl: false, // We handle OAuth callback manually in /auth
      lockAcquireTimeout: 30000, // 30s to avoid lock steal/broken errors from tab throttling
    }),
  }
}
