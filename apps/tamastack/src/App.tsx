import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import { LogBox } from 'react-native'

import { config } from './tamagui.config'

LogBox.ignoreAllLogs()

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack gap="$5" flex={1} bg="plum" jc="center" p="$8">
        <Text
          textAlign="center"
          fontSize="$9"
          color="palegoldenrod"
          fow="$9"
          letterSpacing={-1}
        >
          tamagui.dev/vite
        </Text>
      </Stack>
    </TamaguiProvider>
  )
}
