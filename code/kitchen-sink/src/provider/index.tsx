import { ToastProvider } from '@tamagui/toast'
import type { TamaguiProviderProps } from '@tamagui/ui'
import { TamaguiProvider } from '@tamagui/ui'

import config from '../tamagui.config'
import { NavigationProvider } from './navigation'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      <ToastProvider swipeDirection="horizontal">
        <NavigationProvider>{children}</NavigationProvider>
      </ToastProvider>
    </TamaguiProvider>
  )
}
