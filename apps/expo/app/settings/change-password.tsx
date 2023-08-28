import { ChangePasswordScreen } from 'app/features/settings/change-password-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'Change Password',
        }}
      />
      <ChangePasswordScreen />
    </SafeAreaView>
  )
}
