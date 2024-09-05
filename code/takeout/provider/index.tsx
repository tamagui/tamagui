import type React from 'react'

import { UserThemeProvider } from '@tamagui/one-theme'

// import { QueryClientProvider } from './react-query'
// import { SafeAreaProvider } from './safe-area'
import { AuthProvider } from '~/features/auth'
import { WebsiteTamaguiProvider } from './tamagui/index' // TODO [40E4]: will error "EISDIR: illegal operation on a directory, read" on vxrn React Native without the '/index'. Note that this does not happen for '~/features/auth'
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

const Providers = compose([AuthProvider, WebsiteTamaguiProvider, UserThemeProvider])
