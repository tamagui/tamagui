import { TamaguiProvider, type TamaguiProviderProps } from 'tamagui'

import config from '../../../src/tamagui.config'
// import { NavigationProvider } from './navigation'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      {children}
    </TamaguiProvider>
  )
}
