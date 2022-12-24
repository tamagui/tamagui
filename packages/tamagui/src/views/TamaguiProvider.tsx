import type { TamaguiProviderProps } from '@tamagui/core'
import { TamaguiProvider as OGProvider, isRSC } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'

export const TamaguiProvider = isRSC
  ? OGProvider
  : ({ children, ...props }: TamaguiProviderProps) => {
      return (
        <OGProvider {...props}>
          <PortalProvider shouldAddRootHost>{children}</PortalProvider>
        </OGProvider>
      )
    }
