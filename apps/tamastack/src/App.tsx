import { Stack, TamaguiProvider } from '@tamagui/core'
import { View } from 'react-native'

// import { default as config } from './tamagui.config'

export function App() {
  console.log('🍄🍄🍄 hello world 123', !!TamaguiProvider, !!Stack)
  return (
    // <TamaguiProvider config={config}>
    <View style={{ backgroundColor: 'red', width: 200, height: 200 }} />
    // <Stack backgroundColor="blue" width={100} height={100} />
    // </TamaguiProvider>
  )
}
