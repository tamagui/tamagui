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
}: {
  initialSession: SessionContextProviderProps['initialSession']
  children: React.ReactNode
}) => {
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient({
      // cookieOptions: {
      //   domain: 'localhost',
      //   maxAge: '100000000',
      //   path: '/',
      //   sameSite: 'Lax',
      //   secure: 'secure',
      // },
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
