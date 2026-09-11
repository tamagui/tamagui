import type { AuthClient, Session } from '@supabase/auth-js'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

// Lightweight wrapper that provides the same interface as SupabaseClient
// but only includes auth functionality (no realtime/ws dependencies)
type SupabaseAuthOnlyClient = {
  auth: InstanceType<typeof AuthClient>
}

const STORAGE_KEY = 'sb-auth-token'

let client: SupabaseAuthOnlyClient | null = null
let loading: Promise<SupabaseAuthOnlyClient | null> | null = null

// auth-js is ~97kb with the webauthn helper it depends on, and the site header
// mounts useUser on every page. load it on demand instead: a signed-out visitor
// never pays for it, and a signed-in one only pays when the token needs refreshing.
export function getAuthClient(): Promise<SupabaseAuthOnlyClient | null> {
  if (typeof window === 'undefined') return Promise.resolve(null)
  if (client) return Promise.resolve(client)
  loading ||= import('./authClient').then(({ createAuthClient }) => {
    client = createAuthClient()
    if (client) {
      globalThis['supabaseClient'] = client
    }
    return client
  })
  return loading
}

function readStoredSession(): { access_token: string; expires_at?: number } | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    const parsed = JSON.parse(stored)
    return typeof parsed?.access_token === 'string' ? parsed : null
  } catch {
    return null
  }
}

// Get the current access token - can be called outside React
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const stored = readStoredSession()
  if (!stored) return null

  // only pull in auth-js when the stored token is spent and needs a refresh
  if (stored.expires_at && stored.expires_at * 1000 - Date.now() > 60_000) {
    return stored.access_token
  }

  const supabase = await getAuthClient()
  if (!supabase) return null

  const { data, error } = await supabase.auth.getSession()
  return error ? null : (data.session?.access_token ?? null)
}

export function useSupabaseClient(given?: SupabaseAuthOnlyClient) {
  const [current, setCurrent] = useState(() => given ?? client)

  useEffect(() => {
    if (current) return
    let cancelled = false
    getAuthClient().then((next) => {
      if (!cancelled && next) {
        setCurrent(next)
      }
    })
    return () => {
      cancelled = true
    }
  }, [current])

  return current as SupabaseAuthOnlyClient
}

export function useSupabaseSession(client?: SupabaseAuthOnlyClient) {
  const supabase = useSupabaseClient(client)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    if (!supabase) return // Client not ready yet

    const run = async () => {
      const reply = await supabase.auth.getSession()

      if (reply.error) {
        console.error(`Error authenticating`, reply.error)
        setSession(null)
        return
      }

      // Always update session state (including when null after logout)
      setSession(reply.data.session)
    }

    run()

    // Listen for auth changes to update session state
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return session
}

export const useSupabase = () => {
  const supabase = useSupabaseClient()
  const session = useSupabaseSession(supabase)
  const swrClient = useSWRConfig()

  useEffect(() => {
    if (!supabase) return

    const listener = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      // Skip events that shouldn't trigger user data refetch:
      // - TOKEN_REFRESHED: fires periodically (~hourly), would cause unnecessary refetches
      // - INITIAL_SESSION: fires on page load, SWR already handles initial fetch
      if (event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION') {
        return
      }

      // Skip if same user already signed in (prevents duplicate fetches)
      if (event === 'SIGNED_IN') {
        if (session?.user.id === currentSession?.user.id) {
          return
        }
      }

      await swrClient.mutate('user')
    })
    return () => listener.data.subscription.unsubscribe()
  }, [supabase, session])

  return {
    supabase,
    session,
  }
}
