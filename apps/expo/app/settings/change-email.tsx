import { ChangeEmailScreen } from 'app/features/settings/change-email-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Change Email',
        }}
      />
      <ChangeEmailScreen />
    </SafeAreaView>
  )
}
