import { BaseToastOptions as BurntToastOptions } from 'burnt/build/types'

export interface CreateNativeToastOptions {
  /**
   * Body of the toast
   */
  message?: BurntToastOptions['message']
  /**
   * Duration of toast in ms
   *
   * @example 1000
   */
  duration?: BurntToastOptions['duration']
  /**
   * Options for the burnt package if you're using native toasts on mobile
   */
  burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>
  /**
   * Options for the notification API if you're using native toasts on web
   */
  notificationOptions?: NotificationOptions
}

export interface NativeToastRef {
  /**
   * Used to close web notifications
   */
  close: () => void
}

export type CreateNativeToastsFn = (
  title: string,
  options: CreateNativeToastOptions
) =>
  | {
      nativeToastRef?: NativeToastRef
    }
  | boolean

export type HideNativeToastsFn = (ref?: NativeToastRef) => void

export type ToastNativePlatform = 'web' | 'mobile' | 'android' | 'ios'
export type ToastNativeValue = boolean | ToastNativePlatform | ToastNativePlatform[]
