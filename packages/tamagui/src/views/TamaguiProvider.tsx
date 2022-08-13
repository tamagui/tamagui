import { TamaguiProvider as OGProvider } from '@tamagui/core'
import type { TamaguiProviderProps } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import * as React from 'react'

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  // RSC test
  // if (typeof document === 'undefined') {
  //   return <OGProvider {...props}>{children}</OGProvider>
  // }

  return (
    <OGProvider {...props}>
      <PortalProvider>{children}</PortalProvider>
    </OGProvider>
  )
}
