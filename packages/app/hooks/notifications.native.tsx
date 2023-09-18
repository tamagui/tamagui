import { Platform } from 'react-native'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../utils/api'
// import { useQuery } from '@tanstack/react-query'

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
    token = (
      await Notifications.getExpoPushTokenAsync({
        // Should be an expo env var
        projectId: 'f90e58a7-e2f9-408c-8655-8e00d2037f16',
      })
    ).data
  } else {
    // TODO: make this a toast
    alert('Must use physical device for Push Notifications')
  }

  return token || ''
}
// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}
export function useNativeNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string>('')
  const [token, setToken] = useState<string>('')
  const [shouldFetchToken, setShouldFetchToken] = useState<boolean>(false)
  const [notification, setNotification] = useState<Notifications.Notification | false>(false)
  const updateProfileMuation = api.me.profile.update.useMutation()

  const notificationListener =
    useRef<ReturnType<typeof Notifications.addNotificationReceivedListener>>()
  const responseListener =
    useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener>>()

  useQuery(
    ['getExpoPushToken'],
    async () => {
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: 'f90e58a7-e2f9-408c-8655-8e00d2037f16',
        })
        return token.data
      } catch (error) {
        console.log(error)
      }

      return token
    },
    {
      enabled: shouldFetchToken,
      onSuccess: (token) => {
        setExpoPushToken(token ?? '')
        updateProfileMuation.mutate({ expo_token: token })
        setShouldFetchToken(false)
        console.log(token)
        setToken(token ?? '')
      },
    }
  )

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

  return {
    expoPushToken,
    notification,
    schedulePushNotification,
    token,
    shouldFetchToken,
    setShouldFetchToken,
  }
}
