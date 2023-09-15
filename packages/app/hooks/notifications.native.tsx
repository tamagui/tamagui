import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// https://docs.expo.dev/versions/latest/sdk/notifications/
// To handle notifications while the app is in the background on iOS, add remote-notification as a value to the array under ios.infoPlist.UIBackgroundModes key in your app config, and add "content-available": 1 to your push notification payload. Under normal circumstances, the "content-available" flag should launch your app if it isn't running and wasn't killed by the user. However, this is ultimately decided by the OS, so it might not always happen.

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  })
}

async function registerForPushNotificationsAsync() {
  let token: string | undefined

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data
    console.log(token)
  } else {
    // TODO: make this a toast
    alert('Must use physical device for Push Notifications')
  }

  return token || ''
}

export function useNativeNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('')
  const [notification, setNotification] = useState<Notifications.Notification | false>(false)
  const notificationListener =
    useRef<ReturnType<typeof Notifications.addNotificationReceivedListener>>()
  const responseListener =
    useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>()

  useEffect(() => {
    // Should probably do something else here
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? 'no token'))

    if (notificationListener.current) {
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          setNotification(notification)
        }
      )
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response)
    })

    return () => {
      if (notificationListener.current && responseListener.current) {
        Notifications.removeNotificationSubscription(notificationListener?.current)
        Notifications.removeNotificationSubscription(responseListener?.current)
      }
    }
  }, [])

  return { expoPushToken, notification, schedulePushNotification }
}
