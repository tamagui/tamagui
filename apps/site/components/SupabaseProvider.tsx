import { Database } from '@lib/supabase-types'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import {
  SessionContextProvider,
  SessionContextProviderProps,
} from '@supabase/auth-helpers-react'
import { MyUserContextProvider } from 'hooks/useUser'
import { useState } from 'react'

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
      <MyUserContextProvider>{children}</MyUserContextProvider>
    </SessionContextProvider>
  )
}
