import { CreateNativeToastsOptionsFn } from './types'

export const createNativeToast: CreateNativeToastsOptionsFn = (title, { message }) => {
  if (!('Notification' in window)) {
    throw Error('This browser does not support desktop notification')
  }

  if (Notification.permission === 'denied') return {}

  const showNotification = () => {
    new Notification(title, {
      body: message,
    })
  }

  if (Notification.permission === 'granted') {
    showNotification()
  } else {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        showNotification()
      }
    })
  }
}
