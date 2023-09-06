import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { Stack, TamaguiProvider, Text, useChangeThemeEffect } from '@tamagui/core'
import { ExpoRoot } from '@tamagui/expo-router'
import { useEffect } from 'react'

import { default as config } from './tamagui.config'

// @ts-ignore
const modules = import.meta.glob('../app/**/*.tsx')

console.log('ExpoRoot', ExpoRoot, modules)

// test RN
// import { View } from 'react-native'
// export function App() {
//   return <View style={{ backgroundColor: 'red', width: 222, height: 200 }} />
// }

const linking = {
  prefixes: [
    /* your linking prefixes */
  ],
  config: {
    screens: {},
    /* configuration for matching screens with paths */
  },
} satisfies LinkingOptions<any>

export function App() {
  useEffect(() => {
    const home = modules['../app/home.tsx']()

    home.then((res) => {
      console.log('got page', res.default)
    })
  }, [])

  return (
    <NavigationContainer linking={linking}>
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
    </NavigationContainer>
  )
}
