import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { ToastProvider } from '@tamagui/toast/v1'
import { config as defaultConfig } from './config'

export function Provider({
  children,
  config = defaultConfig,
  defaultTheme = 'light',
  ...rest
}: Partial<TamaguiProviderProps> & { config?: any }) {
  return (
    <TamaguiProvider config={config} defaultTheme={defaultTheme} {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </TamaguiProvider>
  )
}
