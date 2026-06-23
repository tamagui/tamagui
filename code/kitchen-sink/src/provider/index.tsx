import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'

import config from '../tamagui.config'
import { useInsets } from './useInsets'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  const insets = useInsets()

  return (
    <TamaguiProvider config={config} defaultTheme="light" insets={insets} {...rest}>
      {children}
    </TamaguiProvider>
  )
}
