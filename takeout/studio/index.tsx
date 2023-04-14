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
        <Studio />
      </TamaguiProvider>
    </SessionContextProvider>
  )
}

createRoot(document.querySelector('#root')!).render(<App />)
