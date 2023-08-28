import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, SessionContextProviderProps } from '@supabase/auth-helpers-react'
import { AUTH_COOKIE_NAME } from 'app/utils/auth'
import { useState } from 'react'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'

export type AuthProviderProps = {
  initialSession?: SessionContextProviderProps['initialSession']
  children?: React.ReactNode
}

export const AuthProvider = ({ initialSession, children }: AuthProviderProps) => {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({ cookieOptions: { name: AUTH_COOKIE_NAME } })
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <AuthStateChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
