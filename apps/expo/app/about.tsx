import { AboutScreen } from 'app/features/legal/about-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'About' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <AboutScreen />
      </SafeAreaView>
    </>
  )
}
