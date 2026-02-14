import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'

import config from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      {children}
    </TamaguiProvider>
  )
}
