import { TamaguiProvider as OGProvider } from '@tamagui/core'
import type { TamaguiProviderProps } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import * as React from 'react'

export function TamaguiProvider({ children, ...props }: TamaguiProviderProps) {
  return (
    <OGProvider {...props}>
      <PortalProvider>{children}</PortalProvider>
    </OGProvider>
  )
}
