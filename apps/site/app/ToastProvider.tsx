'use client'

import {
  Toast,
  ToastProps,
  ToastProvider as ToastProviderOG,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast'

export let toast: ReturnType<typeof useToastController>

// this feels weird but it works... TODO: might want to add some variation of this to @tamagui/toast cause useToastController can be a bit cumbersome to use outside react
const ToastImportHandler = () => {
  const toastController = useToastController()
  toast = toastController
  return null
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProviderOG>
      <ToastHandler />
      {children}
      <ToastImportHandler />
      <ToastViewport className="m-2" />
    </ToastProviderOG>
  )
}
const ToastHandler = () => {
  const toast = useToastState()
  if (!toast) return null

  return (
    <Toast
      key={toast.id}
      duration={toast.duration}
      animation="quick"
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      {...toast.customData}
    >
      <Toast.Title>{toast.title}</Toast.Title>
      <Toast.Description>{toast.message}</Toast.Description>
    </Toast>
  )
}

declare module '@tamagui/toast' {
  interface CustomData extends ToastProps {}
}
