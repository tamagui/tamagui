import { Database } from '@lib/supabase-types'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import {
  SessionContextProvider,
  SessionContextProviderProps,
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
    createBrowserSupabaseClient<Database>({
      // supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      cookieOptions: isStudio
        ? undefined
        : {
            domain: process.env.NODE_ENV === 'production' ? 'tamagui.dev' : 'localhost',
            maxAge: 1000 * 60 * 60 * 24 * 365,
            path: '/',
            sameSite: 'lax',
            secure: true,
          },
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
        await fetch('/api/github-sync', { method: 'POST' })
      }

      await swrClient.mutate('user')
    })
    return () => listener.data.subscription.unsubscribe()
  }, [session])

  return <>{children}</>
}
