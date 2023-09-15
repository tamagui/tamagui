import { SignInScreen } from 'app/features/auth/sign-in-screen'
import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { useSafeAreaInsets } from 'app/utils/useSafeAreaInsets'
import { Theme, YStack, getThemes, getToken } from '@my/ui'

export default function Screen() {
  const safeAreaInsets = useSafeAreaInsets()
  return (
    <Theme name="purple">
      <SafeAreaView
        style={{
          flex: 1,
        }}
        edges={['bottom', 'left', 'right']}
      >
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <YStack f={1} pt={safeAreaInsets.top} bg="$color3">
          <SignInScreen />
        </YStack>
      </SafeAreaView>
    </Theme>
  )
}
