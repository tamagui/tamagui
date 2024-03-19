import type { CreateNativeToastsFn, HideNativeToastsFn } from './types'

export const createNativeToast: CreateNativeToastsFn = (
  title,
  { message, notificationOptions }
) => {
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications')
    return false
  }

  if (Notification.permission === 'denied') false
  const showNotification = () => {
    const notification = new Notification(title, {
      body: message,
      ...notificationOptions,
    })

    return notification
  }

  if (Notification.permission === 'granted') {
    const notification = showNotification()
    return {
      nativeToastRef: notification,
    }
  }
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      const notification = showNotification()
      return {
        nativeToastRef: notification,
      }
    }
  })
  return true
}

export const hideNativeToast: HideNativeToastsFn = (ref) => {
  if (!('Notification' in window)) {
    console.error('This browser does not support notifications')
    return
  }

  if (ref) {
    ref.close()
  }
}
