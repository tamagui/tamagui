import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { ToastProvider } from '@tamagui/toast'

import config from '../tamagui.config'

export function Provider({
  children,
  ...rest
}: Omit<Partial<TamaguiProviderProps>, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      <ToastProvider swipeDirection="horizontal" duration={5000}>
        {children}
      </ToastProvider>
    </TamaguiProvider>
  )
}
