// debug 1232
import React, { useState } from 'react'
import {
  Button,
  Circle,
  Image,
  Paragraph,
  Spacer,
  Square,
  Theme,
  XStack,
  YStack,
  styled,
} from 'tamagui'

import favicon from './public/favicon.svg'
import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme="light">
      <Theme name={theme}>
        <YStack w="100%" h="100%" bc="$background" p="$5" space="$5">
          <a onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>Switch theme</a>
          <Test />
        </YStack>
      </Theme>
    </Tamagui.Provider>
  )
}

export const Test = (props) => {
  return (
    <>
      <YStack
        br="$10"
        borderWidth={1}
        w={22}
        h={22}
        ai="center"
        jc="center"
        borderColor="transparent"
        cursor="pointer"
        {...(!!props.isActive && {
          borderColor: '$color',
        })}
        {...(!props.isActive && {
          hoverStyle: {
            borderColor: '$colorMid',
          },
        })}
      >
        <YStack p={2} my={-1}>
          {/* @ts-ignore */}
          <Circle size={16} backgroundColor="$background" {...props} />
        </YStack>
      </YStack>

      <XStack
        btw={1}
        blw={1}
        brw={1}
        bbw={1}
        bc="$background"
        ov="hidden"
        f={1}
        py="$1"
        px="$2"
        ai="center"
        jc="center"
        {...props}
      >
        <Circle size={16}>
          <Image width={12} height={12} src={favicon.src} />
        </Circle>
        <Spacer size="$2" />
      </XStack>

      <Card
        width="33.33%"
        $sm={{ width: 'auto' }}
        space
        tag="a"
        href="https://twitter.com/tamagui_js"
        target="_blank"
        rel="noopener noreferrer"
        p="$4"
      />

      {/* scale not applying compile */}
      {/* <HomeH2 className="rainbow clip-text" scale="$12">
        All-in-one
      </HomeH2> */}

      <Image
        // debug
        pos="absolute"
        bottom={0}
        left={0}
        x={-10}
        y={10}
        scale={0.75}
        src="http://placekitten.com/800/800"
        width={544}
        height={569}
      />

      <AnimationTest />
    </>
  )
}

export const Card = styled(YStack, {
  name: 'Card',
  className: 'transition all ease-in ms100',
  borderRadius: '$2',
  backgroundColor: '$background',
  flexShrink: 1,
  elevation: '$2',
  hoverStyle: {
    backgroundColor: '$backgroundHover',
    elevation: '$4',
    y: -4,
  },
})

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
