import { ToastProvider } from '@tamagui/toast'
import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import config from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest} insets={useSafeAreaInsets()}>
      <ToastProvider swipeDirection="horizontal">{children}</ToastProvider>
    </TamaguiProvider>
  )
}
