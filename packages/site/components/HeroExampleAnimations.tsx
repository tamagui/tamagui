import { Play } from '@tamagui/feather-icons'
import Link from 'next/link'
import React, { useRef, useState } from 'react'
import { ScrollView } from 'react-native'
import { Button, Paragraph, Separator, Square, Theme, ThemeReset, XStack, YStack } from 'tamagui'

import { animations } from '../constants/animations'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'
import { LogoIcon } from './TamaguiLogo'
import { useOnIntersecting } from './useOnIntersecting'

const positions = [
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
  },
  {
    x: 50,
    y: 50,
    scale: 1,
    rotate: '180deg',
  },
]

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
    description: 'A quick, straightforward spring',
    animation: 'quick',
    settings: animations.animations.quick,
  },
] as const

let hasScrolledOnce = false

export function HeroExampleAnimations() {
  const [animationI, setAnimationI] = useState(0)
  const [positionI, setPositionI] = useState(2)
  const position = positions[positionI]
  const animation = animationDescriptions[animationI]
  const { tint } = useTint()
  const next = (to = 1) => {
    setPositionI((x) => (x + to) % positions.length)
  }
  const container = useRef(null)

  const settings = Object.entries(animation.settings)

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
    <YStack>
      <ContainerLarge position="relative" space="$6">
        <YStack zi={1} space="$1">
          <HomeH2>First-class animations</HomeH2>
          <HomeH3>Plug-and-play drivers for every platform.</HomeH3>
        </YStack>

        <XStack
          bw={1}
          boc={`$${tint}5`}
          borderStyle="dashed"
          w="100%"
          br="$6"
          ov="hidden"
          // bc="$backgroundHover"
          h={305}
          maw={880}
          als="center"
          x={0}
        >
          <Theme name={tint}>
            <YStack
              ref={container}
              pos="relative"
              // className="hero-gradient"
              ai="center"
              jc="center"
              width="60%"
              $sm={{ width: '100%' }}
            >
              <Square
                animated
                animation={animation.animation}
                elevation="$4"
                size={110}
                bc="$color"
                br="$9"
                onPress={() => next()}
                {...position}
              >
                <LogoIcon downscale={0.75} />
              </Square>

              <Button
                pos="absolute"
                bottom={20}
                right={20}
                circular
                iconAfter={Play}
                theme={tint}
                size="$6"
                onPress={() => next()}
              />
            </YStack>
          </Theme>

          <Separator vertical />

          <YStack pos="relative" $sm={{ display: 'none' }} width="40%">
            <YStack fullscreen zi={-1} theme="alt2" bc="$background" />
            <ScrollView>
              {animationDescriptions.map((item, i) => {
                const isActive = item === animation
                return (
                  <Theme key={item.name} name={isActive ? null : 'alt2'}>
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
                      <Paragraph selectable={false} size="$3" cursor="inherit" theme="alt2">
                        {item.description}
                      </Paragraph>
                    </YStack>
                  </Theme>
                )
              })}
            </ScrollView>

            <Separator />

            <XStack bc="$background" p="$4" ai="center" jc="center">
              {settings.map(([key, value], i) => {
                return (
                  <React.Fragment key={key}>
                    <YStack>
                      <Paragraph size="$2" fow="800">
                        {key}
                      </Paragraph>
                      <Paragraph>{value}</Paragraph>
                    </YStack>
                    {i < settings.length - 1 && <Separator vertical mx={20} />}
                  </React.Fragment>
                )
              })}
            </XStack>
          </YStack>
        </XStack>

        <XStack als="center" space="$1">
          <Link href="/docs/core/animations#css" passHref>
            <Button theme={tint} tag="a">
              CSS &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations#reanimated" passHref>
            <Button theme={tint} tag="a">
              Reanimated &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations" passHref>
            <Button tag="a">Docs &raquo;</Button>
          </Link>
        </XStack>
      </ContainerLarge>
    </YStack>
  )
}
