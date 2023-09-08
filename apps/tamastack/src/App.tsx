import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import { LogBox } from 'react-native'

import { config } from './tamagui.config'

LogBox.ignoreAllLogs()

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack
        gap="$5"
        f={1}
        bg="pink"
        jc="center"
        p="$8"
      >
        <Text ta="center" fos="$9" col="#fff" fow="bold">
          hello
        </Text>
      </Stack>
    </TamaguiProvider>
  )
}
