// @tamagui/toast — the v2 composable + imperative toast API. The v1 imperative
// surface (Toast/ToastProvider/ToastViewport/useToastController/useToastState)
// was removed in v3; see the upgrade guide. The styled default skin lives in
// `tamagui` (tamagui/toast + the `tamagui` root).

// composable component API
export { Toast, useToasts, useToastItem } from './ToastComposable'
export type {
  ToastRootProps,
  ToastViewportProps,
  ToastItemProps,
  ToastItemRenderProps,
  ToastListProps,
  ToastPosition,
  ToastIcons,
} from './ToastComposable'

// imperative API
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

// all-in-one component (thin wrapper over the composable API)
export { Toaster } from './Toaster'
export type { ToasterProps, ToasterPosition } from './Toaster'

export type { SwipeDirection } from './types'
export type { BurntToastOptions, CreateNativeToastOptions, NativeToastRef } from './types'
export { requestNotificationPermission } from './createNativeToast'
