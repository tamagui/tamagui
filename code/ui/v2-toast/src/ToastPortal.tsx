import { Portal } from '@tamagui/portal'
import type { ReactNode } from 'react'
import { Platform } from 'react-native'
import { ReprogapateToastProvider, type ToastProviderContextValue } from './ToastProvider'

export function ToastPortal(props: {
  children: ReactNode
  zIndex?: number
  context: ToastProviderContextValue
}) {
  const { context, children, zIndex } = props
  let content = children
  if (Platform.OS === 'android' || Platform.OS === 'ios') {
    content = (
      <ReprogapateToastProvider context={context}>{children}</ReprogapateToastProvider>
    )
  }
  return <Portal zIndex={zIndex || Number.MAX_SAFE_INTEGER}>{content}</Portal>
}
