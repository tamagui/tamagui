import { ToastProvider } from '@tamagui/toast'
import { isWeb } from '@tamagui/constants'
import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import config from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  const insets = isWeb ? undefined : useSafeAreaInsets()
  return (
    <TamaguiProvider config={config} defaultTheme="light" insets={insets} {...rest}>
      <ToastProvider swipeDirection="horizontal">{children}</ToastProvider>
    </TamaguiProvider>
  )
}
