import { Stack } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CreateScreen } from 'app/features/create/climb-screen'

export default function Screen() {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right']}>
      <Stack.Screen
        options={{
          title: 'New Project',
        }}
      />
      <CreateScreen />
    </SafeAreaView>
  )
}
