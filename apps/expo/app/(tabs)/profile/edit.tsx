import { EditProfileScreen } from 'app/features/profile/edit-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Edit Profile',
        }}
      />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <EditProfileScreen />
      </SafeAreaView>
    </>
  )
}
