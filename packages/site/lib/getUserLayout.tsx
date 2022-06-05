import { supabaseClient } from '@supabase/supabase-auth-helpers/nextjs'
import { UserProvider } from '@supabase/supabase-auth-helpers/react'
import { MyUserContextProvider } from 'hooks/useUser'

export function getUserLayout(page) {
  return <UserLayout>{page}</UserLayout>
}

function UserLayout({ children }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <MyUserContextProvider supabaseClient={supabaseClient}>{children}</MyUserContextProvider>
    </UserProvider>
  )
}
