import { Portal } from '@tamagui/portal'
import * as React from 'react'
import { Platform } from 'react-native'

import { ReprogapateToastProvider, useToastProviderContext } from './ToastProvider'

export function ToastPortal({
  children,
  zIndex,
}: {
  children: React.ReactNode
  zIndex?: number
}) {
  let content = children
  if (Platform.OS === 'android') {
    content = (
      <ReprogapateToastProvider context={useToastProviderContext()}>
        {children}
      </ReprogapateToastProvider>
    )
  }
  return <Portal zIndex={zIndex || 1000000000}>{content}</Portal>
}
