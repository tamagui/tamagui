import { ProfileScreen } from 'app/features/profile/screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Profile',
          headerShown: false,
        }}
      />
      <ProfileScreen />
    </>
  )
}
