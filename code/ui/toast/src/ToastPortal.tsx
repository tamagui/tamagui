import { isWeb } from '@tamagui/constants'
import { Portal } from '@tamagui/portal'
import type { ReactNode } from 'react'
import { ReprogapateToastProvider, type ToastProviderContextValue } from './ToastProvider'

export function ToastPortal(props: {
  children: ReactNode
  zIndex?: number
  context: ToastProviderContextValue
}) {
  const { context, children, zIndex } = props
  let content = children
  if (!isWeb) {
    content = (
      <ReprogapateToastProvider context={context}>{children}</ReprogapateToastProvider>
    )
  }
  return <Portal zIndex={zIndex || Number.MAX_SAFE_INTEGER}>{content}</Portal>
}
