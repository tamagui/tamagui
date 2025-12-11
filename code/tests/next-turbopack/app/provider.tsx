'use client'

import { TamaguiProvider as Provider } from '@tamagui/core'
import config from '../tamagui.config'

export function TamaguiProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider config={config} defaultTheme="light">
      {children}
    </Provider>
  )
}
