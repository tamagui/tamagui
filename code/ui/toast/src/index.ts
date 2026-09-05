// @tamagui/toast — the unstyled composable + imperative toast API. Most apps
// should import the styled version from `tamagui` instead; this package is the
// behavior layer the skin is built on.
//
// The old imperative surface (ToastProvider/ToastViewport/useToastController/
// useToastState) was removed in v3; see the upgrade guide. Native OS toasts are
// optional — install `burnt` and pass `native` only if you want them.

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

export type { SwipeDirection } from './types'
export type { BurntToastOptions, CreateNativeToastOptions, NativeToastRef } from './types'
export { requestNotificationPermission } from './createNativeToast'
