import { TamaguiProvider as OGProvider, isRSC } from '@tamagui/core'
import type { TamaguiProviderProps } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { useSetupHasSSRRendered } from '@tamagui/use-did-finish-ssr'
import * as React from 'react'

export const TamaguiProvider = isRSC
  ? OGProvider
  : ({ children, ...props }: TamaguiProviderProps) => {
      /**
       * This effect should be the last effect to finish in the whole tree.
       */
      useSetupHasSSRRendered()

      return (
        <OGProvider {...props}>
          <PortalProvider>{children}</PortalProvider>
        </OGProvider>
      )
    }
