import type { Database } from '@lib/supabase-types'
import { supabaseCookieOptions } from '@lib/supabase-utils'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import type {
  SessionContextProviderProps} from '@supabase/auth-helpers-react';
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
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient<Database>({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      cookieOptions: supabaseCookieOptions,
    })
  )
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
