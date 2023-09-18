import React from 'react'

export function useWebNotifications() {
  const schedulePushNotification = React.useCallback(() => {
    // This doesn't do anything right now
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
