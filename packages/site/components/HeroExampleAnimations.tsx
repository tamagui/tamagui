import { ArrowDown } from '@tamagui/feather-icons'
import Link from 'next/link'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, Paragraph, Separator, Theme, XStack, YStack } from 'tamagui'

import { animations } from '../constants/animations'
import { CodeDemo } from './CodeDemo'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import AnimationsDemo from './demos/AnimationsDemo'
import { HomeH2, HomeH3 } from './HomeH2'
import { useOnIntersecting } from './useOnIntersecting'

const animationDescriptions = [
  {
    name: 'Bouncy',
    description: 'A bouncy spring',
    animation: 'bouncy',
    settings: animations.animations.bouncy,
  },
  {
    name: 'Lazy',
    description: 'A lazy, straightforward spring',
    animation: 'lazy',
    settings: animations.animations.lazy,
  },
  {
    name: 'Quick',
    description: 'A super fast spring',
    animation: 'quick',
    settings: animations.animations.quick,
  },
] as const

let hasScrolledOnce = false

export function HeroExampleAnimations() {
  const { tint } = useTint()
  const [disableScrollPane, setDisableScrollPane] = useState(true)

  return (
    <YStack>
      <ContainerLarge position="relative" space="$6">
        <YStack zi={1} space="$1">
          <HomeH2 pos="relative">
            <span className="rainbow clip-text">Animated</span>
            <Button
              tag="span"
              pe="none"
              size="$3"
              theme="pink"
              pos="absolute"
              t={-10}
              r={-70}
              rotate="5deg"
            >
              New
            </Button>
          </HomeH2>
          <HomeH3>Plug-and-play drivers for every platform.</HomeH3>
        </YStack>

        <XStack>
          <YStack
            f={2}
            miw="55%"
            als="center"
            mr="$-2"
            bc="$backgroundHover"
            zi={100}
            elevation="$4"
            br="$4"
          >
            <ExampleAnimations />
          </YStack>

          <YStack
            perspective={1000}
            rotateY="-5deg"
            x={-10}
            $sm={{ display: 'none' }}
            pos="relative"
            br="$8"
            elevation="$5"
            ov="hidden"
          >
            <YStack
              pe={disableScrollPane ? 'auto' : 'none'}
              o={disableScrollPane ? 1 : 0}
              fullscreen
              ai="center"
              jc="center"
            >
              <YStack
                fullscreen
                top="60%"
                // className="mask-gradient-up"
                o={0.5}
                // bc="rgba(0,0,0,0.2)"
              />
              <Button
                accessibilityLabel="View more"
                y={200}
                iconAfter={ArrowDown}
                size="$4"
                themeInverse
                zi={10}
                onPress={() => setDisableScrollPane(false)}
              >
                View more
              </Button>
            </YStack>

            <CodeDemo
              pe={disableScrollPane ? 'none' : 'auto'}
              maxHeight={500}
              maxWidth={530}
              language="jsx"
              value={`import { Button, Square } from 'tamagui'

export default () => {
  const [positionI, setPositionI] = React.useState(0)
  return (
    <>
      <Square
        animation="animation
        size={110}
        bc="$pink10"
        br="$9"
        hoverStyle={{
          scale: 1.1,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...positions[positionI]}
      >
        <LogoIcon />
      </Square>

      <Button
        pos="absolute"
        b={20}
        l={20}
        icon={require('@tamagui/feather-icons').Play}
        size="$6"
        circular
        onPress={() => setPositionI(i => (i + 1) % positions.length)}
      />
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
      scale: 1.1,
    },
    pressStyle: {
      scale: 0.9,
    },
  },
]
`}
            />
          </YStack>
        </XStack>

        <XStack als="center" space="$1">
          <Link href="/docs/core/animations#css" passHref>
            <Button accessibilityLabel="CSS docs" fontFamily="$silkscreen" theme={tint} tag="a">
              CSS &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations#reanimated" passHref>
            <Button
              accessibilityLabel="Reanimated docs"
              fontFamily="$silkscreen"
              theme={tint}
              tag="a"
            >
              Reanimated &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations" passHref>
            <Button accessibilityLabel="Animation docs" fontFamily="$silkscreen" tag="a">
              Docs &raquo;
            </Button>
          </Link>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}

export const ExampleAnimations = memo(() => {
  const [animationI, setAnimationI] = useState(0)
  const animation = animationDescriptions[animationI]
  const { tint } = useTint()
  const container = useRef(null)
  const [positionI, setPositionI] = useState(2)
  const next = (to = 1) => {
    setPositionI((x) => (x + to) % 3)
  }

  const settings =
    typeof animation.settings === 'string'
      ? [['transition', animation.settings]]
      : Object.entries(animation.settings)

  useOnIntersecting(container, ({ isIntersecting, dispose }) => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next()
      }
      if (e.key === 'ArrowLeft') {
        next(-1)
      }
    }

    if (isIntersecting) {
      if (!hasScrolledOnce) {
        hasScrolledOnce = true
        // dont rush
        setTimeout(() => {
          next()
        }, 400)
      }
      window.addEventListener('keydown', onKey)
      return () => {
        window.removeEventListener('keydown', onKey)
      }
    } else {
      dispose?.()
    }
  })

  return (
    <XStack
      bw={1}
      boc={`$${tint}5`}
      elevation="$1"
      w="100%"
      br="$6"
      ov="hidden"
      h={305}
      als="center"
      x={0}
      flexDirection="row-reverse"
    >
      <Theme name={tint}>
        <YStack
          ref={container}
          pos="relative"
          bc="$background"
          ai="center"
          jc="center"
          width="60%"
          $sm={{ width: '100%' }}
        >
          <AnimationsDemo position={positionI} animation={animation.animation} />
        </YStack>
      </Theme>

      <Separator vertical />

      <YStack pos="relative" $sm={{ display: 'none' }} width="40%">
        <YStack fullscreen zi={-1} theme="alt2" bc="$backgroundPress" />
        <YStack f={1}>
          {animationDescriptions.map((item, i) => {
            const isActive = item === animation
            return (
              <Theme key={item.name} name={isActive ? 'active' : 'alt1'}>
                <YStack
                  {...(isActive && {
                    bc: '$backgroundHover',
                  })}
                  px="$4"
                  bc="$background"
                  py="$2"
                  cursor="pointer"
                  hoverStyle={{
                    bc: '$backgroundHover',
                  }}
                  onPress={() => {
                    setAnimationI(i)
                    next()
                  }}
                >
                  <Paragraph
                    mb="$-1"
                    selectable={false}
                    cursor="inherit"
                    size="$3"
                    fontWeight="800"
                  >
                    {item.name}
                  </Paragraph>
                  <Paragraph ellipse selectable={false} size="$2" cursor="inherit" theme="alt2">
                    {item.description}
                  </Paragraph>
                </YStack>
              </Theme>
            )
          })}
        </YStack>

        <Separator />

        <XStack bc="$background" p="$4" ai="center" jc="center">
          {settings.map(([key, value], i) => {
            if (key === 'type') {
              return null
            }
            return (
              <React.Fragment key={key}>
                <YStack>
                  <Paragraph size="$2">{key}</Paragraph>
                  <Paragraph>{value}</Paragraph>
                </YStack>
                {i < settings.length - 1 && <Separator vertical mx={15} />}
              </React.Fragment>
            )
          })}
        </XStack>
      </YStack>
    </XStack>
  )
})
