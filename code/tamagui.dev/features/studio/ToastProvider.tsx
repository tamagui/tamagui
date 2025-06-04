import type { ToastProps } from '@tamagui/toast'
import {
  Toast,
  ToastProvider as ToastProviderOG,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast'
import { AnimatePresence, Theme, YStack } from 'tamagui'

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
      <ToastViewport m="$0.5" left="50%" x="-50%" bottom={0} />
    </ToastProviderOG>
  )
}

const ToastHandler = () => {
  const toast = useToastState()

  // avoid rendering the toast if it's a demo toast
  if (!toast || toast?.demo) return null

  return (
    <Theme name="accent">
      <Toast
        key={toast.title + toast.message}
        duration={toast.duration ?? 3000}
        animation="200ms"
        enterStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
        exitStyle={{ opacity: 0, transform: [{ translateY: 100 }] }}
        transform={[{ translateY: 0 }]}
        bottom={0}
        opacity={1}
        gap={0}
        {...toast.customData}
      >
        <YStack gap={0}>
          <Toast.Title>{toast.title}</Toast.Title>
          <Toast.Description>{toast.message}</Toast.Description>
        </YStack>
      </Toast>
    </Theme>
  )
}

declare module '@tamagui/toast' {
  interface CustomData extends ToastProps {}
}
