// from `burnt`
type BurntLayout = {
  iconSize?: {
    width: number
    height: number
  }
}

// from `burnt`
export type BurntToastOptions = {
  title: string
  message?: string
  /**
   * Defaults to `done`.
   */
  preset?: 'done' | 'error' | 'none'
  /**
   * Duration in seconds.
   */
  duration?: number
  haptic?: 'success' | 'warning' | 'error' | 'none'
  /**
   * Defaults to `true`.
   */
  shouldDismissByDrag?: boolean
  /**
   * Change the presentation side.
   * @platform ios
   */
  from?: 'top' | 'bottom'
  layout?: BurntLayout
}

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
