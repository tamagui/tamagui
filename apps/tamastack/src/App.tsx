import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import { ExpoRoot } from '@tamagui/expo-router'
import { useEffect, useState } from 'react'

import { default as config } from './tamagui.config'

// @ts-ignore
const modules = import.meta.glob('../app/**/*.tsx')

console.log('ExpoRoot', ExpoRoot)

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
  const [Home, setHome] = useState<any>(null)

  useEffect(() => {
    const home = modules['../app/home.tsx']()
    home.then((res) => {
      setHome(res.default)
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
            💥2
          </Text>

          {Home ? Home : null}
        </Stack>
      </TamaguiProvider>
    </NavigationContainer>
  )
}
