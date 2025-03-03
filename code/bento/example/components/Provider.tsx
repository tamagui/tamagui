import { ToastProvider } from '@tamagui/toast'
import type { TamaguiProviderProps } from 'tamagui'
import { TamaguiProvider } from 'tamagui'
import { SchemeProvider } from '@vxrn/color-scheme'

import config from '../../tamagui.config'

export function Provider({ children, ...rest }: Omit<TamaguiProviderProps, 'config'>) {
  return (
    <TamaguiProvider config={config} defaultTheme="light" {...rest}>
      <SchemeProvider>
        <ToastProvider swipeDirection="horizontal">{children}</ToastProvider>
      </SchemeProvider>
    </TamaguiProvider>
  )
}
