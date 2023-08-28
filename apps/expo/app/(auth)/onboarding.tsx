import { OnboardingScreen } from 'app/features/auth/onboarding-screen'
import { Stack } from 'expo-router'

export default function Screen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <OnboardingScreen />
    </>
  )
}
