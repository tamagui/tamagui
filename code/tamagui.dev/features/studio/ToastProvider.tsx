import type { ToastProps } from '@tamagui/toast'
import {
  Toast,
  ToastProvider as ToastProviderOG,
  ToastViewport,
  useToastController,
  useToastState,
} from '@tamagui/toast'
import { AnimatePresence, Theme } from 'tamagui'

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
      <ToastViewport bg="red" m="$0.5" left="50%" x="-50%" bottom={0} />
    </ToastProviderOG>
  )
}

const ToastHandler = () => {
  const toast = useToastState()
  if (!toast) return null

  return (
    <Theme name="accent">
      <AnimatePresence>
        <Toast
          key={toast.title + toast.message}
          duration={toast.duration}
          animation="bouncy"
          enterStyle={{ opacity: 0, scale: 1, y: 15 }}
          exitStyle={{ opacity: 0, scale: 1, y: -15 }}
          y={0}
          position="absolute"
          bottom={0}
          left="50%"
          x="-50%"
          opacity={1}
          scale={1}
          elevation="$6"
          m="$4"
          br="$10"
          bg="$color1"
          px="$5"
          py="$2"
          {...toast.customData}
        >
          <Toast.Title whiteSpace="pre">{toast.title}</Toast.Title>
          <Toast.Description>{toast.message}</Toast.Description>
        </Toast>
      </AnimatePresence>
    </Theme>
  )
}

declare module '@tamagui/toast' {
  interface CustomData extends ToastProps {}
}
