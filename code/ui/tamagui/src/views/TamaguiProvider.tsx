import type { TamaguiProviderProps } from '@tamagui/core'
import { TamaguiProvider as OGProvider } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'

export const TamaguiProvider = ({ children, ...props }: TamaguiProviderProps) => {
  return (
    <OGProvider {...props}>
      <PortalProvider shouldAddRootHost>{children}</PortalProvider>
    </OGProvider>
  )
}
