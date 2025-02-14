import type { TamaguiProviderProps } from '@tamagui/core'
import { TamaguiProvider as OGProvider } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { ZIndexStackContext } from '@tamagui/z-index-stack'

export const TamaguiProvider = ({ children, ...props }: TamaguiProviderProps) => {
  return (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )
}
