import { SessionContextProvider, SessionContextProviderProps } from '@supabase/auth-helpers-react'
import { AUTH_COOKIE_NAME } from 'app/utils/auth'
import { useState } from 'react'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'

export type AuthProviderProps = {
  initialSession?: SessionContextProviderProps['initialSession']
  children?: React.ReactNode
}

export const AuthProvider = ({ initialSession, children }: AuthProviderProps) => {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createBrowserSupabaseClient({
      cookieOptions: { name: AUTH_COOKIE_NAME, domain: '', secure: false, path: '' },
    })
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <AuthStateChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
