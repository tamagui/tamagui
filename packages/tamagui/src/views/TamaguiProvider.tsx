import { TamaguiProvider as OGProvider, isRSC } from '@tamagui/core'
import type { TamaguiProviderProps } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import * as React from 'react'

export const TamaguiProvider = isRSC
  ? OGProvider
  : ({ children, ...props }: TamaguiProviderProps) => {
      return (
        <OGProvider {...props}>
          <PortalProvider>{children}</PortalProvider>
        </OGProvider>
      )
    }
