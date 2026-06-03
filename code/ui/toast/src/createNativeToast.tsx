import type { CreateNativeToastsFn, HideNativeToastsFn } from './types'

export const createNativeToast: CreateNativeToastsFn = (
  title,
  { message, notificationOptions }
) => {
  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission !== 'granted') return false

  const notification = new Notification(title, {
    body: message,
    ...notificationOptions,
  })

  return {
    nativeToastRef: notification,
  }
}

export const hideNativeToast: HideNativeToastsFn = (ref) => {
  if (!('Notification' in window)) {
    return
  }

  if (ref) {
    ref.close()
  }
}

/**
 * Request notification permission from the browser.
 * Must be called from a user gesture (click/tap handler).
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (!('Notification' in window)) return null
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  return Notification.requestPermission()
}
