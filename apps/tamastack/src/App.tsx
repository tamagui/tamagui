import { Stack, TamaguiProvider, Text } from '@tamagui/core'

import { default as config } from './tamagui.config'

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack
        f={1}
        w="100%"
        h="100%"
        ai="center"
        jc="center"
        als="center"
        m="auto"
        bg="#B3FF00"
      >
        <Text color="#AA12A2" fow="800" fos={100} ta="center">
          💥
        </Text>
      </Stack>
    </TamaguiProvider>
  )
}
