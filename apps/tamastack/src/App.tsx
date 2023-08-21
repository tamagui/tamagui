import { Stack, TamaguiProvider, Text } from '@tamagui/core'

import { default as config } from './tamagui.config'

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack
        f={1}
        w="100%"
        ai="center"
        jc="center"
        als="center"
        m="auto"
        bg="#3FB9C2"
        h={400}
      >
        <Text color="#8C4D86" fow="800" fos={70} ta="center">
          vite + rn = ❤️
        </Text>
      </Stack>
    </TamaguiProvider>
  )
}
