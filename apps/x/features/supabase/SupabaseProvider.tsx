import type { Database } from './types'
import { supabaseCookieOptions } from './helpers'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type { SessionContextProviderProps } from '@supabase/auth-helpers-react'
import {
  SessionContextProvider,
  useSession,
  useSupabaseClient,
} from '@supabase/auth-helpers-react'
import { useEffect, useState } from 'react'
import { useSWRConfig } from 'swr'

export const SupabaseProvider = ({
  initialSession,
  children,
  isStudio = false,
}: {
  initialSession: SessionContextProviderProps['initialSession']
  children: React.ReactNode
  isStudio?: boolean
}) => {
  const [supabaseClient] = useState(() => {
    return createPagesBrowserClient<Database>({
      supabaseUrl: import.meta.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseKey: import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      cookieOptions: supabaseCookieOptions,
    })
  })
  return (
    <SessionContextProvider
      initialSession={initialSession}
      supabaseClient={supabaseClient}
    >
      <SupabaseInside>{children}</SupabaseInside>
    </SessionContextProvider>
  )
}

const SupabaseInside = ({ children }: { children: React.ReactNode }) => {
  const supabase = useSupabaseClient()
  const session = useSession()
  const swrClient = useSWRConfig()

  useEffect(() => {
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
  }, [session])

  return <>{children}</>
}
