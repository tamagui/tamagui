import { Portal } from '@tamagui/portal'
import { Platform } from 'react-native'
import { ReprogapateToastProvider, useToastProviderContext } from './ToastProvider'
import type { ReactNode } from 'react'

export function ToastPortal({
  children,
  zIndex,
}: {
  children: ReactNode
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
