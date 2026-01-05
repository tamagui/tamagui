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

function getClient(): SupabaseAuthOnlyClient | null {
  if (!client) {
    client = createClient()
    if (client) {
      globalThis['supabaseClient'] = client
    }
  }
  return client
}

// Get the current access token - can be called outside React
export async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null

  const c = getClient()
  if (!c) return null

  const { data, error } = await c.auth.getSession()
  if (error || !data.session) return null

  return data.session.access_token
}

export function useSupabaseClient(given?: SupabaseAuthOnlyClient) {
  const [current, setCurrent] = useState<SupabaseAuthOnlyClient | null>(
    () => given ?? getClient()
  )

  useEffect(() => {
    if (current) return
    const c = getClient()
    if (c) {
      setCurrent(c)
    }
  }, [current])

  return current
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
        return
      }

      if (reply.data.session) {
        setSession(reply.data.session)
      }
    }

    run()
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
