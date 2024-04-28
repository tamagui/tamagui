import type { ToastProps } from '@tamagui/toast'
import {
  Toast,
  ToastProvider as ToastProviderOG,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast'

export let toastController: ReturnType<typeof useToastController>

// this feels weird but it works... TODO: might want to add some variation of this to @tamagui/toast cause useToastController can be a bit cumbersome to use outside react
const ToastImportHandler = () => {
  toastController = useToastController()
  return null
}

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProviderOG swipeDirection="vertical" swipeThreshold={80}>
      <ToastHandler />
      {children}
      <ToastImportHandler />
      <ToastViewport m="$0.5" left="50%" x="-50%" top={0} />
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
      animation="100ms"
      enterStyle={{ opacity: 0, scale: 0.5, y: -45 }}
      exitStyle={{ opacity: 0, scale: 1, y: -40 }}
      y={0}
      x={0}
      opacity={1}
      scale={1}
      elevation="$6"
      m="$4"
      br="$10"
      px="$5"
      py="$2"
      {...toast.customData}
    >
      <Toast.Title o={0.6}>{toast.title}</Toast.Title>
      <Toast.Description o={0.6}>{toast.message}</Toast.Description>
    </Toast>
  )
}

declare module '@tamagui/toast' {
  interface CustomData extends ToastProps {}
}
