import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import {
  SessionContextProvider,
  SupabaseClient,
  useSession,
  useSessionContext,
  useSupabaseClient,
  useUser,
} from '@supabase/auth-helpers-react'
import { createClient } from '@supabase/supabase-js'
import { config as configBase } from '@tamagui/config'
import { useSharedAuth } from '@tamagui/site-shared'
import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { H1, Paragraph, TamaguiProvider, YStack, createTamagui } from 'tamagui'

import { Studio } from './src'
import { checkForSponsorship } from './src/api/gql'

globalThis['React'] = React

const config = createTamagui({
  ...configBase,
  themeClassNameOnRoot: false,
})

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}

const App = () => {
  const [supabaseClient] = useState(() =>
    createClient(
      (import.meta as any).env.VITE_PUBLIC_SUPABASE_URL!,
      (import.meta as any).env.VITE_PUBLIC_SUPABASE_ANON_KEY!
    )
  )

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <TamaguiProvider config={config} defaultTheme="light">
        <link href="/fonts/inter.css" rel="stylesheet" />
        <AppInner />
      </TamaguiProvider>
    </SessionContextProvider>
  )
}

const AppInner = () => {
  const [loading, setLoading] = useState(true)
  const supabase = useSupabaseClient()
  const user = useUser()

  useSharedAuth(supabase, {
    onUnauthenticated: () => {
      location.href = (import.meta as any).env.DEV
        ? 'http://localhost:5005/signin'
        : 'https://tamagui.dev/signin'
    },
    onAuthenticated: async (session) => {
      const githubLogin = session.user?.identities?.find(
        (identity) => identity.provider === 'github'
      )?.identity_data?.user_name
      if (!githubLogin) {
        alert(
          "You haven't used GitHub to log in. Please log in with GitHub and try again."
        )
        await supabase.auth.signOut()
        location.href = (import.meta as any).env.DEV
          ? 'http://localhost:5005/signin'
          : 'https://tamagui.dev/signin'
      }
      const isSponsoring = await checkForSponsorship(githubLogin)
      if (!isSponsoring) {
        alert(`You are not a tamagui sponsor. Sponsor the project to access Studio.`)
        location.href = `https://github.com/sponsors/natew`
      }
      setLoading(false)
    },
  })

  if (loading) {
    return (
      <YStack flex={1} ai="center" jc="center">
        <H1>loading user data...</H1>
      </YStack>
    )
  }
  return <Studio />
}

createRoot(document.querySelector('#root')!).render(<App />)
