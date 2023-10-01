import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import { LogBox } from 'react-native'

// import { App as ExpoRouterApp } from './ExpoRouterApp'
import { config } from './tamagui.config'

LogBox.ignoreAllLogs()

// export const App = ExpoRouterApp

export function App() {
  return (
    <TamaguiProvider config={config}>
      <Stack gap="$5" f={1} bg="limegreen" jc="center" p="$8" height="100%">
        <Text ta="center" fontSize={50} col="#9DFFC8" fow="bold">
          👋
        </Text>
      </Stack>
    </TamaguiProvider>
  )
}
