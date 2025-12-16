import { ToastProvider } from '@tamagui/toast'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'

import config from '../tamagui.config'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  const insets = useSafeAreaInsets()

  return (
    <TamaguiProvider config={config} defaultTheme="light" insets={insets} {...rest}>
      <ToastProvider swipeDirection="horizontal">{children}</ToastProvider>
    </TamaguiProvider>
  )
}
