import { Theme, YStack } from '@my/ui'
import { SignUpScreen } from 'app/features/auth/sign-up-screen'
import { Stack } from 'expo-router'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'

export default function Screen() {
  const safeAreaInsets = useSafeAreaInsets()
  return (
    <Theme name="green">
      <SafeAreaView
        style={{
          flex: 1,
        }}
        edges={['left', 'right']}
      >
        <YStack
          pt={safeAreaInsets.top}
          pb={safeAreaInsets.bottom}
          f={1}
          bg={'$color3'}
        >
          <Stack.Screen
            options={{
              headerShown: false,
            }}
          />
          <SignUpScreen />
        </YStack>
      </SafeAreaView>
    </Theme>
  )
}
