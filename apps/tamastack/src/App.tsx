// import { LinkingOptions, NavigationContainer } from '@react-navigation/native'
import { Stack, TamaguiProvider, Text } from '@tamagui/core'
import * as React from 'react'

import { default as config } from './tamagui.config'

console.log('React', React)

// const linking = {
//   prefixes: [
//     /* your linking prefixes */
//   ],
//   config: {
//     screens: {},
//     /* configuration for matching screens with paths */
//   },
// } satisfies LinkingOptions<any>

export function App() {
  return (
    // <NavigationContainer linking={linking}>
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
    // </NavigationContainer>
  )
}
