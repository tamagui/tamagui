import React from 'react'

export function useNativeNotifications() {
  const schedulePushNotification = React.useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      const notificationId = setTimeout(() => {
        alert('TODO: add notifications')
      }, 2000)
      return () => {
        clearTimeout(notificationId)
      }
    })
  }, [])
  return { schedulePushNotification }
}
