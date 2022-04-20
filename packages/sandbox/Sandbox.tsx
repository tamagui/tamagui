// debug-verbose
import { ChevronLeft, ChevronRight, Lock } from '@tamagui/feather-icons'
import React, { memo, useRef, useState } from 'react'
import {
  Button,
  Circle,
  H2,
  Image,
  Paragraph,
  ParagraphProps,
  SizableText,
  Spacer,
  Stack,
  Text,
  Theme,
  VisuallyHidden,
  XStack,
  YStack,
  YStackProps,
} from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

// type y = ParagraphProps['size']
// const x = <SizableText size="$1" />
// const x2 = <Paragraph size="$1" />

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

// export const Test = (props) => {
//   const ref = useRef()

//   return (
//     <>
//       <YStack key={props.ley} ref={ref} onPress={props.onPress} />
//       <Button rotate="-5deg" theme="pink_alt2" tag="a" size="$3">
//         Beta.0
//       </Button>
//       <Button rotate="-5deg" theme="pink_alt2" tag="a" size="$3">
//         Beta.0
//       </Button>
//       <Paragraph size="$2" theme="alt2">
//         by
//         <Button>nate</Button>
//       </Paragraph>
//       <Paragraph theme="alt2">
//         Cross-browser server-side rendering, even for responsive styles and variants out of the box.
//         Next.js plugin and example apps.
//       </Paragraph>
//       <VisuallyHidden>something</VisuallyHidden>
//     </>
//   )
// }

export const Test = (props) => {
  const [positionI, setPositionI] = useState(0)
  return (
    <>
      <YStack
        bc="blue"
        o={1}
        debug
        width={`${1 * 50}%`}
        height={10}
        minWidth={100}
        position="relative"
        jc="center"
        animation="bouncy"
        scale={positionI * 1 + 1}
        opacity={1}
        enterStyle={{
          scale: 0.3,
          opacity: 0.5,
        }}
        hoverStyle={{
          scale: 2,
          backgroundColor: 'red',
        }}
        pressStyle={{
          scale: 0.5,
          backgroundColor: 'green',
        }}
      >
        <Paragraph size="$1" whiteSpace="nowrap" position="absolute" right="$-1" x="100%">
          123ms
        </Paragraph>
      </YStack>
      <Button
        onPress={() => {
          setPositionI((x) => (x + 1) % 4)
        }}
      >
        pressStyle
      </Button>
    </>
  )
}

//

//      <AnimationTest />

// export const Card = styled(YStack, {
//   name: 'Card',
//   className: 'transition all ease-in ms100',
//   borderRadius: '$2',
//   backgroundColor: '$background',
//   flexShrink: 1,
//   elevation: '$2',
//   hoverStyle: {
//     backgroundColor: '$color',
//     elevation: '$4',
//     y: -4,
//   },
// })

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
