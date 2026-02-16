import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<TamaguiProviderProps> & { config?: any }) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      {children}
    </TamaguiProvider>
  )
}
