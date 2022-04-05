// debug
import { useCallback, useState } from 'react'
import { Button, Theme, XStack, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme="light">
      <Theme name={theme}>
        <YStack w="100%" h="100%" bc="$background" p="$5" space="$5">
          <Button onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Switch theme
          </Button>
          <Test />
        </YStack>
      </Theme>
    </Tamagui.Provider>
  )
}

export const Test = () => {
  return <Button tag="a">Benchmarks &raquo;</Button>
}

// export const Test2 = () => {
//   return (
//     <XStack width={1200} height={200} pos="relative">
//       <Marker name="1" l={300} />
//       <Marker name="2" l={500} />
//       <Marker name="3" l={800} />
//     </XStack>
//   )
// }

// const Marker = ({ name, active, onPress, ...props }: any) => {
//   return (
//     <YStack pos="absolute" l={800} {...props}>
//       <XStack bc="red" pe="none" ai="flex-start" space>
//         <YStack w={3} h={80} bc="red" opacity={active ? 0.5 : 0.2} />
//         <Button
//           borderWidth={1}
//           size="$3"
//           onPress={() => {
//             onPress(name)
//           }}
//         >
//           {name}
//         </Button>
//       </XStack>
//     </YStack>
//   )
// }
