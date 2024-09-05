import type { Session, SupabaseClient } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'
import type { Database } from '../supabase/types'

type OurClient = SupabaseClient<Database>

let client: OurClient | null = null

// lazy load it only once needed (auth page)

export function useSupabaseClient(given?: SupabaseClient) {
  const [current, setCurrent] = useState(given ?? client)

  useEffect(() => {
    const run = async () => {
      if (current || client) return

      const { createBrowserClient } = await import('@supabase/ssr')

      if (
        !import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
        !import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        console.error(`Missing supabase info`)
      }

      client = createBrowserClient(
        import.meta.env.NEXT_PUBLIC_SUPABASE_URL!,
        import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      globalThis['supabaseClient'] = client
      // client!.auth.initialize()

      setCurrent(client)
    }

    run()
  }, [current])

  return current as OurClient
}

export function useSupabaseSession(client?: OurClient) {
  const supabase = useSupabaseClient(client)
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    const run = async () => {
      const reply = await supabase?.auth.getSession()

      if (!reply || reply.error) {
        console.error(
          `Error authenticating`,
          reply,
          import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
          import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        )
        return
      }

      if (!reply.data.session) {
        console.warn(`no session data`)
        return
      }

      setSession(reply.data.session)
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
        await fetch('/api/account-sync', { method: 'POST' })
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
