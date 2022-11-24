import { TamaguiProvider, TamaguiProviderProps } from '@starter/ui'

import config from '../tamagui.config'
import { NavigationProvider } from './navigation'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} disableInjectCSS defaultTheme="light" {...rest}>
      <NavigationProvider>{children}</NavigationProvider>
    </TamaguiProvider>
  )
}
