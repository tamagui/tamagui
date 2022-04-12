// debug
import { useState } from 'react'
import React from 'react'
import { Button, Square, Theme, YStack } from 'tamagui'

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
  // return <AnimationTest />
  return (
    <Button borderRadius={1000} tag="a" fontWeight="800">
      Documentation
    </Button>
  )
}

const AnimationTest = () => {
  const [positionI, setPositionI] = useState(0)
  const position = positions[positionI]
  const next = (to = 1) => {
    setPositionI((x) => {
      return (x + to) % positions.length
    })
  }

  return (
    <>
      <Square
        animation="bouncy"
        debug
        elevation="$4"
        size={110}
        bc="red"
        br="$9"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
        onPress={() => next()}
      />

      <Button pos="absolute" bottom={20} left={20} size="$6" circular onPress={() => next()} />
    </>
  )
}

export const positions = [
  {
    x: 0,
    y: 0,
    scale: 1,
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: 0.5,
    rotate: '-45deg',
    hoverStyle: {
      scale: 0.6,
      x: -85,
      y: -85,
    },
    pressStyle: {
      scale: 0.4,
    },
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
    hoverStyle: {
      scale: 1,
    },
    pressStyle: {
      scale: 1,
    },
  },
]

// export const HomeH2 = styled(H2, {
//   debug: true,

//   mt: -20,
//   ta: 'center',
//   als: 'center',
//   size: '$10',
//   letterSpacing: -2,
//   fontSize: 40,

//   $sm: {
//     size: '$2',
//     bc: 'red',
//     letterSpacing: -1,
//   },
// })

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
