import { Session } from '@supabase/supabase-js'
import { Provider } from 'app/provider'
import { supabase } from 'app/utils/supabase/client.native'
import { useFonts } from 'expo-font'
import * as Notifications from 'expo-notifications'
import { SplashScreen, Stack, router } from 'expo-router'
import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
// import { LogBox } from 'react-native'

// LogBox.ignoreAllLogs()

SplashScreen.preventAutoHideAsync()

function useNotificationObserver() {
  React.useEffect(() => {
    let isMounted = true

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url
      if (url) {
        router.push(url)
      }
    }

    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (!isMounted || !response?.notification) {
        return
      }
      redirect(response?.notification)
    })

    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        redirect(response.notification)
      }
    )

    return () => {
      isMounted = false
      subscription.remove()
    }
  }, [])
}

export default function HomeLayout() {
  const [fontLoaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  })

  const [sessionLoadAttempted, setSessionLoadAttempted] = useState(false)
  const [initialSession, setInitialSession] = useState<Session>()
  useNotificationObserver()
  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (data) {
          setInitialSession(data?.session ?? undefined)
        }
      })
      .finally(() => {
        setSessionLoadAttempted(true)
      })
  }, [])
  const onLayoutRootView = useCallback(async () => {
    if (fontLoaded && sessionLoadAttempted) {
      await SplashScreen.hideAsync()
    }
  }, [fontLoaded, sessionLoadAttempted])

  if (!fontLoaded || !sessionLoadAttempted) {
    return null
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Provider initialSession={initialSession}>
        <Stack />
      </Provider>
    </View>
  )
}
