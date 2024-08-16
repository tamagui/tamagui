import type React from 'react'

import { UserThemeProvider } from '@tamagui/one-theme'

// import { AuthProvider } from './auth'
// import { QueryClientProvider } from './react-query'
// import { SafeAreaProvider } from './safe-area'
import { WebsiteTamaguiProvider } from './tamagui'
// import { UniversalThemeProvider } from './theme'
// import { ToastProvider } from './toast'

export function Provider({
  children,
}: {
  children: React.ReactNode
}) {
  return <Providers>{children}</Providers>
}

const compose = (providers: React.FC<{ children: React.ReactNode }>[]) =>
  providers.reduce((Prev, Curr) => ({ children }) => {
    const Provider = Prev ? (
      <Prev>
        <Curr>{children}</Curr>
      </Prev>
    ) : (
      <Curr>{children}</Curr>
    )
    return Provider
  })

const Providers = compose([WebsiteTamaguiProvider, UserThemeProvider])
