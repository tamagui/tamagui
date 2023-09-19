import { Button, H3, Paragraph, YStack } from '@my/ui'
import { useNativeNotifications } from 'app/hooks/notifications.native'
import { api } from 'app/utils/api'
import { useUser } from 'app/utils/useUser'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  const notifMutation = api.me.testNotifFromServer.useMutation()
  const user = useUser()
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'notifications',
        }}
      />
      <YStack>
        <H3>Notifications</H3>
        <H3>EXPO Push Token</H3>
        <Paragraph>{user?.profile?.expo_token}</Paragraph>
        {/* <Button onPress={schedulePushNotification}>Local Push Notification</Button> */}
        {/* <Button onPress={getToken}>Get Token</Button> */}
      </YStack>

      <Button
        themeInverse
        onPress={() => {
          notifMutation.mutate({
            title: 'buttholes',
            body: 'yum',
          })
        }}
      >
        Get A notification from the server
      </Button>
    </SafeAreaView>
  )
}
