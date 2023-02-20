export const createNativeToast = ({
  title,
  duration,
  preset,
  actions,
  body,
}: CreateNativeToastsOptions) => {
  if (!('Notification' in window)) {
    throw Error('This browser does not support desktop notification')
  }

  if (Notification.permission === 'denied') return {}

  const showNotification = () => {
    new Notification(title, {
      body,
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
