// debug-verbose
import React, { useState } from 'react'
import {
  Button,
  Circle,
  Image,
  InteractiveContainer,
  Spacer,
  Square,
  Theme,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme="light">
      <Theme name={theme}>
        <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
          <a
            style={{ marginBottom: 20 }}
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            Switch theme
          </a>
          <Test />
        </div>
      </Theme>
    </Tamagui.Provider>
  )
}

export const Test = (props) => {
  return (
    <>
      <Image
        debug
        pos="absolute"
        bottom={0}
        left={0}
        x={-100}
        y={100}
        scale={0.75}
        src="http://placekitten.com/800/800"
        width={544}
        height={569}
      />
    </>
  )
}

//      <AnimationTest />

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  borderRadius: '$2',
  backgroundColor: '$background',
  flexShrink: 1,
  elevation: '$2',
  hoverStyle: {
    backgroundColor: '$color',
    elevation: '$4',
    y: -4,
  },
})

// const AnimationTest = () => {
//   const [positionI, setPositionI] = useState(0)
//   const position = positions[positionI]
//   const next = (to = 1) => {
//     setPositionI((x) => {
//       return (x + to) % positions.length
//     })
//   }

//   return (
//     <>
//       <Square
//         animation="bouncy"
//         debug
//         elevation="$4"
//         size={110}
//         bc="red"
//         br="$9"
//         hoverStyle={{
//           scale: 1.1,
//         }}
//         pressStyle={{
//           scale: 0.9,
//         }}
//         {...position}
//         onPress={() => next()}
//       />

//       <Button pos="absolute" bottom={20} left={20} size="$6" circular onPress={() => next()} />
//     </>
//   )
// }

// export const positions = [
//   {
//     x: 0,
//     y: 0,
//     scale: 1,
//     rotate: '0deg',
//   },
//   {
//     x: -50,
//     y: -50,
//     scale: 0.5,
//     rotate: '-45deg',
//     hoverStyle: {
//       scale: 0.6,
//       x: -85,
//       y: -85,
//     },
//     pressStyle: {
//       scale: 0.4,
//     },
//   },
//   {
//     x: 50,
//     y: 50,
//     scale: 1,
//     rotate: '180deg',
//     hoverStyle: {
//       scale: 1,
//     },
//     pressStyle: {
//       scale: 1,
//     },
//   },
// ]
