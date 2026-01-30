import { AuthClient, type Session } from '@supabase/auth-js'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

// Lightweight wrapper that provides the same interface as SupabaseClient
// but only includes auth functionality (no realtime/ws dependencies)
type SupabaseAuthOnlyClient = {
  auth: InstanceType<typeof AuthClient>
}

// Initialize client eagerly - @supabase/auth-js is small (~30kb) and has no ws/realtime deps
function createClient(): SupabaseAuthOnlyClient | null {
  if (typeof window === 'undefined') return null

  if (
    !import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
    !import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    console.error(`Missing supabase info`)
    return null
  }

  const authClient = new AuthClient({
    url: `${import.meta.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1`,
    headers: {
      apikey: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
    },
    storageKey: 'sb-auth-token',
    storage: window.localStorage,
    flowType: 'pkce',
    detectSessionInUrl: false, // We handle OAuth callback manually in /auth
  })

  return { auth: authClient }
}

let client: SupabaseAuthOnlyClient | null = null

// Get the current access token - can be called outside React
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  // Ensure client is initialized
  if (!client) {
    client = createClient()
    if (client) {
      globalThis['supabaseClient'] = client
    }
  }

  // Try via client first
  if (client) {
    const { data, error } = await client.auth.getSession()
    if (!error && data.session) {
      return data.session.access_token
    }
  }

  // Fallback: read directly from localStorage
  // This handles the case where SWR fetches before the client is fully ready
  try {
    const stored = localStorage.getItem('sb-auth-token')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.access_token) {
        return parsed.access_token
      }
    }
  } catch {
    // ignore parse errors
  }

  return null
}

export function useSupabaseClient(given?: SupabaseAuthOnlyClient) {
  const [current, setCurrent] = useState(() => given ?? client)

  useEffect(() => {
    // if we already have it in state, nothing to do
    if (current) return
    // if module-level client exists, sync it to state
    if (client) {
      setCurrent(client)
      return
    }
    // otherwise create it
    client = createClient()
    if (client) {
      globalThis['supabaseClient'] = client
      setCurrent(client)
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
