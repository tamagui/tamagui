import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { MyUserContextProvider } from 'hooks/useUser'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useState } from 'react'

export function getUserLayout(page) {
  return <UserLayout>{page}</UserLayout>
}

function UserLayout({ children }) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient())
  
  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <MyUserContextProvider supabaseClient={supabaseClient}>
        {children}
      </MyUserContextProvider>
    </SessionContextProvider>
  )
}
