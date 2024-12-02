import { ToastProvider } from '@tamagui/toast'
import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'

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
