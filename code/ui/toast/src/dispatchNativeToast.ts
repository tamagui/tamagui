import type { ToastT } from './ToastState'
import type { BurntToastOptions } from './types'
import { createNativeToast } from './createNativeToast'

/**
 * Attempts to dispatch a toast via native platform API (Burnt on mobile, Notification on web).
 * Returns true if the toast was handled natively, false if it should fall through to in-app.
 */
export function dispatchNativeToast(
  toast: ToastT,
  opts: {
    duration: number
    burntOptions?: Omit<BurntToastOptions, 'title' | 'message' | 'duration'>
    notificationOptions?: NotificationOptions
  }
): boolean {
  const titleText = typeof toast.title === 'function' ? toast.title() : toast.title
  if (typeof titleText !== 'string') return false

  const descText =
    typeof toast.description === 'function' ? toast.description() : toast.description
  const toastType = toast.type ?? 'default'

  const preset: BurntToastOptions['preset'] =
    toastType === 'error' ? 'error' : toastType === 'success' ? 'done' : 'none'
  const haptic: BurntToastOptions['haptic'] =
    toastType === 'error'
      ? 'error'
      : toastType === 'success'
        ? 'success'
        : toastType === 'warning'
          ? 'warning'
          : 'none'

  const result = createNativeToast(titleText, {
    message: typeof descText === 'string' ? descText : undefined,
    duration: toast.duration ?? opts.duration,
    burntOptions: { preset, haptic, ...opts.burntOptions },
    notificationOptions: opts.notificationOptions,
  })

  return result !== false
}
