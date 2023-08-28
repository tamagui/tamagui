import { TermsOfServiceScreen } from 'app/features/legal/terms-of-service-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Screen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: true, title: 'Terms of Service' }} />
      <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
        <TermsOfServiceScreen />
      </SafeAreaView>
    </>
  )
}
