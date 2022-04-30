import { AnimatePresence } from '@tamagui/animate-presence'
import { ArrowLeft, ArrowRight } from '@tamagui/feather-icons'
import React, { useState } from 'react'
import { Button, H1, Image, Theme, VisuallyHidden, XStack, YStack, styled } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme="light">
      <Theme name={theme}>
        <div
          style={{
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
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
      <VisuallyHidden>something</VisuallyHidden>
      <H1
        animation="bouncy"
        enterStyle={{
          opacity: 0,
        }}
        opacity={1}
        size="$9"
        $gtSm={{
          size: '$11',
          ta: 'center',
        }}
        $gtMd={{
          size: '$12',
          maxWidth: 900,
          mx: '$4',
        }}
      >
        Universal design systems for React&nbsp;Native &&nbsp;Web, faster
      </H1>
    </>
  )
}

// adapted from Framer Motion
// https://codesandbox.io/s/framer-motion-image-gallery-pqvx3?from-embed=&file=/src/Example.tsx:1422-1470

const AnimationTest = () => {
  const [[page, direction], setPage] = useState([0, 0])

  const imageIndex = wrap(0, images.length, page)

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection])
  }

  const enterVariant = direction === 1 || direction === 0 ? 'isRight' : 'isLeft'
  const exitVariant = direction === 1 ? 'isLeft' : 'isRight'

  return (
    <>
      <XStack pos="relative" w={700} h={300} ai="center">
        <AnimatePresence enterVariant={enterVariant} exitVariant={exitVariant}>
          <YStackEnterable
            key={page}
            animation="bouncy"
            fullscreen
            x={0}
            o={1}
            // enterStyle={{ x: 0, y: -100 }}
            // exitStyle={{ x: 0, y: 100 }}
          >
            <Image src={images[imageIndex]} width={700} height={300} />
          </YStackEnterable>
        </AnimatePresence>
        <Button
          icon={ArrowLeft}
          circular
          size="$5"
          pos="absolute"
          l="$4"
          onPress={() => paginate(-1)}
        />
        <Button
          icon={ArrowRight}
          circular
          size="$5"
          pos="absolute"
          r="$4"
          onPress={() => paginate(1)}
        />
      </XStack>
    </>
  )
}

const YStackEnterable = styled(YStack, {
  variants: {
    isLeft: { true: { x: -300, opacity: 0 } },
    isRight: { true: { x: 300, opacity: 0 } },
  },
})

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

// const variants = {
//   enter: (direction: number) => {
//     return {
//       x: direction > 0 ? 1000 : -1000,
//       opacity: 0
//     };
//   },
//   center: {
//     zIndex: 1,
//     x: 0,
//     opacity: 1
//   },
//   exit: (direction: number) => {
//     return {
//       zIndex: 0,
//       x: direction < 0 ? 1000 : -1000,
//       opacity: 0
//     };
//   }
// };

// const swipeConfidenceThreshold = 10000;
// const swipePower = (offset: number, velocity: number) => {
//   return Math.abs(offset) * velocity;
// };

export const images = [
  'https://images.unsplash.com/photo-1618472609777-b038f1f04b8d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3164&q=80',
  'https://images.unsplash.com/photo-1649350319582-e7cea99c9c67?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3143&q=80',
  'https://images.unsplash.com/photo-1650018943477-781416d478cf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2982&q=80',
]

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
//         enterStyle={{
//           scale: 0,
//         }}
//         hoverStyle={{
//           scale: 1.1,
//         }}
//         pressStyle={{
//           scale: 0.9,
//         }}
//         {...position}
//         onPress={() => next()}
//       >
//         <Circle size={50} bc="blue" />
//       </Square>

//       <Button pos="absolute" bottom={20} left={20} size="$6" circular onPress={() => next()} />
//     </>
//   )
// }

// const Feature = (props: any) => {
//   const position = positions[props.pos]
//   useLayoutEffect(() => {
//     props.onChange(position)
//   }, [position])
//   return null
// }

// const AnimationTest = () => {
//   const [positionI, setPositionI] = useState(0)
//   const [position, setNow] = useState({})
//   const [scale, setScale] = useState(0)

//   useLayoutEffect(() => {
//     setScale(1)
//   }, [])

//   const style = useAnimatedStyle(
//     () => ({
//       transform: [{ scale: withSpring(scale) }, { translateX: withSpring(position.x) }],
//     }),
//     [scale, position]
//   )

//   return (
//     <>
//       <Feature pos={positionI} onChange={setNow} />
//       <Animated.View
//         style={[
//           {
//             width: 100,
//             height: 100,
//             alignItems: 'center',
//             justifyContent: 'center',
//             backgroundColor: 'red',
//           },
//           style,
//         ]}
//       >
//         <Circle size={50} bc="blue" />
//       </Animated.View>

//       <Button
//         pos="absolute"
//         bottom={20}
//         left={20}
//         size="$6"
//         circular
//         onPress={() => {
//           setPositionI((x) => (x + 1) % positions.length)
//         }}
//       />
//     </>
//   )
// }

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
