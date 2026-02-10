// Toast v1 declarative API (backward compatibility)
// Import from '@tamagui/toast/v1' for the legacy API

export {
  Toast,
  ToastProvider,
  ToastViewport,
  useToast,
  useToastController,
  useToastState,
} from './Toast'

export type {
  ToastProps,
  ToastProviderProps,
  ToastViewportProps,
  ToastActionProps,
  ToastCloseProps,
  ToastDescriptionProps,
  ToastTitleProps,
  ToastNativePlatform,
  ToastNativeValue,
  CustomData,
} from './Toast'

export type { SwipeDirection } from './ToastProvider'
export type { BurntToastOptions, CreateNativeToastOptions, NativeToastRef } from './types'
