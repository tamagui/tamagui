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
  const [disableScroll, setDisableScroll] = useState(false)

  useEffect(() => {
    let tm
    const disable = () => {
      if (!disableScroll) {
        setDisableScroll(true)
      }
      clearTimeout(tm)
      tm = setTimeout(() => {
        setDisableScroll(false)
      }, 300)
    }
    window.addEventListener('scroll', disable, { passive: true })
    return () => {
      clearTimeout(tm)
      window.removeEventListener('scroll', disable)
    }
  }, [disableScroll])

  return (
    <YStack>
      <ContainerLarge position="relative" space="$6">
        <YStack zi={1} space="$1">
          <HomeH2 pos="relative">
            Animations
            <Button pe="none" size="$3" theme="pink" pos="absolute" t={-10} r={-70} rotate="5deg">
              New
            </Button>
          </HomeH2>
          <HomeH3>Plug-and-play drivers for every platform.</HomeH3>
        </YStack>

        <XStack>
          <YStack
            f={2}
            miw="50%"
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
            pe={disableScroll ? 'none' : 'auto'}
            $sm={{ display: 'none' }}
          >
            <CodeDemo
              maxHeight={500}
              maxWidth={530}
              language="jsx"
              value={`import { Button, Square } from 'tamagui'

export default (props) => {
  const [positionI, setPositionI] = React.useState(0)
  return (
    <>
      <Square
        animation={props.animation || 'bouncy'}
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
            <Button fontFamily="$silkscreen" theme={tint} tag="a">
              CSS &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations#reanimated" passHref>
            <Button fontFamily="$silkscreen" theme={tint} tag="a">
              Reanimated &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations" passHref>
            <Button fontFamily="$silkscreen" tag="a">
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
                  <Paragraph selectable={false} cursor="inherit" size="$4" fontWeight="800">
                    {item.name}
                  </Paragraph>
                  <Paragraph ellipse selectable={false} size="$3" cursor="inherit" theme="alt2">
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
                  <Paragraph size="$2" fow="800">
                    {key}
                  </Paragraph>
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
