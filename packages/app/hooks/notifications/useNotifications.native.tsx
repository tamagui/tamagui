import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})
/**
 *
 * Note: Notifications are NOT supported on the iOS simulator or Android simulator.
 * @see https://docs.expo.dev/versions/latest/sdk/notifications/#usage
 *
 */
export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [shouldFetchToken, setShouldFetchToken] = useState<boolean>(false)

  const [notification, setNotification] = useState<Notifications.Notification | false>(false)
  const notificationListener =
    useRef<ReturnType<typeof Notifications.addNotificationReceivedListener>>()
  const responseListener =
    useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>()

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token ?? 'no token'))

    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification)
    })

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

  return {
    expoPushToken,
    notification,
    schedulePushNotification,
    token,
    shouldFetchToken,
    setShouldFetchToken,
  }
}

async function schedulePushNotification(props: {
  title: string
  body: string
  data: Record<string, unknown>
}) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: props.title ?? "You've got mail! 📬",
      body: props.body ?? 'Here is the notification body',
      data: props.data ?? { data: 'goes here' },
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
      // TODO: Should have a way to configure this
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
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data
    console.log(token)
  } else {
    alert('Must use physical device for Push Notifications')
  }

  return token || ''
}
