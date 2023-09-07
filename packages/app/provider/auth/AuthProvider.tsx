import { SessionContextProvider, Session } from '@supabase/auth-helpers-react'

import { useState } from 'react'
import { AuthStateChangeHandler } from './AuthStateChangeHandler'
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@my/supabase/types'

export type AuthProviderProps = {
  initialSession: Session | undefined
  children?: React.ReactNode
}

export const AuthProvider = ({ initialSession, children }: AuthProviderProps) => {
  // Create a new supabase browser client on every first render.
  const [supabaseClient] = useState(() => createPagesBrowserClient<Database>())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      <AuthStateChangeHandler />
      {children}
    </SessionContextProvider>
  )
}
