import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import { View } from 'react-native'

import { default as config } from './tamagui.config'

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack bg="yellowgreen" w={300} h={400} />
      <Text color="red" fontSize={30}></Text>
    </TamaguiProvider>
  )
}
