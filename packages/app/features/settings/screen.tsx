import { Button, Paragraph, ScrollView, Settings, YStack, isWeb, useMedia } from '@my/ui'
import { Bell, Book, Cog, Info, Lock, LogOut, Mail, Moon, Twitter } from '@tamagui/lucide-icons'
import { useThemeSetting } from 'app/provider/theme'
import { redirect } from 'app/utils/redirect'
import { useSupabase } from 'app/utils/supabase/useSupabase'
import { usePathname } from 'app/utils/usePathname'
import { useLink } from 'solito/link'
import { Platform } from 'react-native'
import rootPackageJson from '../../../../package.json'
import packageJson from '../../package.json'

const brandColors = {
  twitter: '#1DA1F2',
}
import { useState, useEffect, useRef, MutableRefObject } from 'react'
import * as Device from 'expo-device'
import { Subscription } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import type { Notification } from 'expo-notifications'
import React from 'react'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

function App() {
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

  return (
    <YStack
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}
    >
      <Paragraph>Your expo push token: {expoPushToken}</Paragraph>
      <YStack style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Paragraph>Title: {notification && notification.request.content.title} </Paragraph>
        <Paragraph>Body: {notification && notification.request.content.body}</Paragraph>
        <Paragraph>
          Data: {notification && JSON.stringify(notification.request.content.data)}
        </Paragraph>
      </YStack>
      <Button
        onPress={async () => {
          await schedulePushNotification()
        }}
      >
        Press to schedule a notification
      </Button>
    </YStack>
  )
}
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
    alert('Must use physical device for Push Notifications')
  }

  return token || ''
}

export const SettingsScreen = () => {
  const media = useMedia()
  const pathname = usePathname()

  return (
    <YStack f={1} gap="$2" jc="space-between">
      <ScrollView>
        <Settings mt="$6">
          <Settings.Items>
            <Settings.Group>
              <Settings.Item
                icon={Cog}
                isActive={pathname === '/settings'}
                {...useLink({ href: '/settings' })}
              >
                <App />
              </Settings.Item>
            </Settings.Group>
            <Settings.Group $gtSm={{ space: '$2' }}>
              <Settings.Item
                icon={Cog}
                isActive={pathname === '/settings' || pathname === 'settings/general'}
                {...useLink({ href: media.sm ? '/settings/general' : '/settings' })}
                accentColor="$green9"
              >
                General
              </Settings.Item>
              <Settings.Item
                icon={Lock}
                isActive={pathname === '/settings/change-password'}
                {...useLink({ href: '/settings/change-password' })}
                accentColor="$green9"
              >
                Change Password
              </Settings.Item>
              <Settings.Item
                icon={Mail}
                isActive={pathname === '/settings/change-email'}
                {...useLink({ href: '/settings/change-email' })}
                accentColor="$green9"
              >
                Change Email
              </Settings.Item>
              <Settings.Item
                icon={Bell}
                isActive={pathname === '/settings/notifications'}
                {...useLink({ href: '/settings/notifications' })}
                accentColor="$orange9"
              >
                Notifications
              </Settings.Item>
            </Settings.Group>
            <Settings.Group>
              {!isWeb && (
                // isWeb is a constant so this isn't really a conditional hook
                // eslint-disable-next-line react-hooks/rules-of-hooks
                <Settings.Item icon={Info} {...useLink({ href: '/about' })} accentColor="$blue9">
                  About
                </Settings.Item>
              )}
              <Settings.Item
                icon={Book}
                isActive={pathname === '/privacy-policy'}
                {...useLink({ href: '/privacy-policy' })}
                accentColor="$purple9"
              >
                Privacy Policy
              </Settings.Item>
              <Settings.Item
                icon={Book}
                isActive={pathname === '/terms-of-service'}
                {...useLink({ href: '/terms-of-service' })}
                accentColor="$purple9"
              >
                Terms Of Service
              </Settings.Item>
              {/* removing about from web since landing pages are more common on web - feel free to add back if needed */}
            </Settings.Group>
            <Settings.Group>
              <Settings.Item
                icon={Twitter}
                onPress={() => redirect('https://twitter.com/belaytionship')}
                accentColor={brandColors.twitter}
              >
                Twitter
              </Settings.Item>
            </Settings.Group>
            <Settings.Group>
              <SettingsThemeAction />
              <SettingsItemLogoutAction />
            </Settings.Group>
          </Settings.Items>
        </Settings>
      </ScrollView>
      {/*
      NOTE: you should probably get the actual native version here using https://www.npmjs.com/package/react-native-version-info
      we just did a simple package.json read since we want to keep things simple for the starter
       */}
      <Paragraph py="$2" ta="center" theme="alt2">
        {rootPackageJson.name} {packageJson.version}
      </Paragraph>
    </YStack>
  )
}

const SettingsThemeAction = () => {
  const { toggle, current } = useThemeSetting()

  return (
    <Settings.Item
      icon={Moon}
      accentColor="$blue9"
      onPress={toggle}
      rightLabel={current}
      // <Switch
      //   size="$4"
      //   checked={resolvedTheme === 'dark'}
      //   onCheckedChange={() => set(resolvedTheme === 'dark' ? 'light' : 'dark')}
      // >
      //   <Switch.Thumb animation="100ms" />
      // </Switch>
    >
      Theme
    </Settings.Item>
  )
}

const SettingsItemLogoutAction = () => {
  const supabase = useSupabase()

  return (
    <Settings.Item icon={LogOut} accentColor="$red9" onPress={() => supabase.auth.signOut()}>
      Log Out
    </Settings.Item>
  )
}
