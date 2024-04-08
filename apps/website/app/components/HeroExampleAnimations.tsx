import { useIsIntersecting } from '@tamagui/demos'
import { useTint } from '@tamagui/logo'
import { ArrowDown } from '@tamagui/lucide-icons'
import { animations } from '@tamagui/site-config'
import { Link } from '~/link'
import React, { memo, useEffect, useRef, useState } from 'react'
import { Button, ListItem, Paragraph, Separator, XStack, YStack } from 'tamagui'

import { AnimationsDemo } from './AnimationsDemo'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { ContainerLarge } from './Container'
import { HomeH2, HomeH3 } from './HomeH2'

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

export function HeroExampleAnimations({ animationCode }) {
  const { tint } = useTint()
  const [disableScrollPane, setDisableScrollPane] = useState(true)

  return (
    <YStack>
      <ContainerLarge position="relative" space="$8">
        <YStack zi={1} space="$3">
          <HomeH2 pos="relative">
            Universal <span className="rainbow clip-text">Animations</span>
          </HomeH2>
          <HomeH3>
            Better platform targeting with animation drivers that can be changed without
            changing code.
          </HomeH3>
        </YStack>

        <XStack>
          <YStack
            f={2}
            miw="55%"
            als="center"
            mr="$-2"
            zi={100}
            elevation="$4"
            br="$4"
            theme={tint as any}
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
              <YStack fullscreen top="60%" o={0.5} />
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

            <CodeDemoPreParsed
              pe={disableScrollPane ? 'none' : 'auto'}
              maxHeight={500}
              height={500}
              maxWidth={530}
              minWidth={530}
              borderRadius="$8"
              language="tsx"
              source={animationCode}
            />
          </YStack>
        </XStack>

        <XStack als="center" space="$3">
          <Link href="/docs/core/animations#css">
            <Button
              accessibilityLabel="CSS docs"
              fontFamily="$silkscreen"
              theme={tint as any}
            >
              CSS &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations#reanimated">
            <Button accessibilityLabel="Reanimated docs" fontFamily="$silkscreen">
              Reanimated &raquo;
            </Button>
          </Link>
          <Link href="/docs/core/animations">
            <Button accessibilityLabel="Animation docs" fontFamily="$silkscreen">
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
  const container = useRef(null)
  const [positionI, setPositionI] = useState(2)
  const isIntersecting = useIsIntersecting(container)
  const next = (to = 1) => {
    setPositionI((x) => (x + to) % 3)
  }

  useEffect(() => {
    if (!isIntersecting) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        next()
      }
      if (e.key === 'ArrowLeft') {
        next(-1)
      }
    }
    if (!hasScrolledOnce) {
      hasScrolledOnce = true
      setTimeout(() => {
        // setting a long timeout extends the total render time a lot.., just slow down animation
        next()
      }, 250)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
    }
  }, [isIntersecting])

  const settings =
    typeof animation.settings === 'string'
      ? [['transition', animation.settings]]
      : Object.entries(animation.settings)

  return (
    <XStack
      bw={1}
      bc="$borderColor"
      elevation="$1"
      w="100%"
      br="$4"
      ov="hidden"
      h={305}
      als="center"
      x={0}
      flexDirection="row-reverse"
    >
      <YStack
        ref={container}
        pos="relative"
        ai="center"
        jc="center"
        width="60%"
        $sm={{ width: '100%' }}
      >
        <YStack fullscreen zi={-1} bg="$background" o={0.5} />
        {isIntersecting ? (
          <AnimationsDemo position={positionI} animation={animation.animation} />
        ) : null}
      </YStack>

      <Separator vertical />

      <YStack pos="relative" $sm={{ display: 'none' }} width="40%">
        <YStack f={1} theme="alt2" bg="$color1">
          {animationDescriptions.map((item, i) => {
            const isActive = item === animation
            return (
              <ListItem
                key={item.name}
                theme={isActive ? 'active' : null}
                px="$4"
                py="$2"
                title={item.name}
                bg={isActive ? '$color2' : '$color1'}
                subTitle={item.description}
                cursor="pointer"
                onPress={() => {
                  setAnimationI(i)
                  next()
                }}
              />
            )
          })}
        </YStack>

        <Separator />

        <XStack bg="$background" p="$4" ai="center" jc="center">
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
