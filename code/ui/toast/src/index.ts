// v1 API (declarative component-based)
export * from './Toast'
export type { SwipeDirection } from './ToastProvider'
export type { BurntToastOptions, CreateNativeToastOptions, NativeToastRef } from './types'

// v2 API (imperative singleton-based)
export { toast } from './ToastState'
export type {
  ToastT,
  ToastType,
  ToastToDismiss,
  ExternalToast,
  PromiseT,
  PromiseData,
  ToastAction,
} from './ToastState'

export { Toaster } from './Toaster'
export type { ToasterProps, ToasterPosition, HeightT } from './Toaster'
