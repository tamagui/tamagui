import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { MyUserContextProvider } from 'hooks/useUser'
import { useState } from 'react'

export function getUserLayout(page) {
  return <UserLayout>{page}</UserLayout>
}

function UserLayout({ children }) {
  return (
    <MyUserContextProvider>
      {children}
    </MyUserContextProvider>
  )
}
