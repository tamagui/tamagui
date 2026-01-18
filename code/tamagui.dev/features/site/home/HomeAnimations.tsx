import { LogoIcon, useTint } from '@tamagui/logo'
import { ArrowDown, Play } from '@tamagui/lucide-icons'
import { animations } from '@tamagui/tamagui-dev-config'
import React, { memo, useEffect, useRef, useState } from 'react'
import {
  Button,
  ListItem,
  Paragraph,
  Separator,
  Square,
  XStack,
  YStack,
  useControllableState,
  useEvent,
} from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { Link } from '~/components/Link'
import { useIsIntersecting } from '~/hooks/useOnIntersecting'
import { CodeDemoPreParsed } from './CodeDemoPreParsed'
import { HomeH2, HomeH3 } from './HomeHeaders'

export const AnimationsDemo = (props) => {
  const { tint } = useTint()
  return <AnimationsDemoBase tint={tint} {...props} />
}

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

export function HomeAnimations({ animationCode }: { animationCode: string }) {
  const { tint } = useTint()
  const [disableScrollPane, setDisableScrollPane] = useState(true)

  return (
    <YStack>
      <ContainerLarge position="relative" gap="$8">
        <YStack z={1} gap="$3">
          <HomeH2 position="relative">
            Universal <span className="rainbow clip-text">Animations</span>
          </HomeH2>
          <HomeH3>
            Better platform targeting with animation drivers that can be changed without
            changing code.
          </HomeH3>
        </YStack>

        <XStack gap="$4">
          <YStack
            flex={2}
            minW="55%"
            self="flex-start"
            z={100}
            elevation="$4"
            rounded="$4"
            theme={tint as any}
            justify="center"
          >
            <ExampleAnimations />
          </YStack>

          <YStack
            perspective={1000}
            rotateY="-5deg"
            $sm={{ display: 'none' }}
            position="relative"
            rounded="$8"
            elevation="$5"
            overflow="hidden"
          >
            <YStack
              pointerEvents={disableScrollPane ? 'auto' : 'none'}
              opacity={disableScrollPane ? 1 : 0}
              fullscreen
              items="center"
              justify="center"
            >
              <YStack fullscreen t="60%" opacity={0.5} />
              <Button
                aria-label="View more"
                y={200}
                iconAfter={ArrowDown}
                size="$4"
                theme="accent"
                z={10}
                onPress={() => setDisableScrollPane((prev) => !prev)}
              >
                View more
              </Button>
            </YStack>

            <CodeDemoPreParsed
              pointerEvents={disableScrollPane ? 'none' : 'auto'}
              height={disableScrollPane ? 500 : 1250}
              transition="quick"
              maxW={530}
              minW={530}
              rounded="$8"
              language="tsx"
              source={animationCode}
            />
          </YStack>
        </XStack>

        <XStack self="center" gap="$3">
          <Link href="/docs/core/animations">
            <Button aria-label="Animation docs">
              <Button.Text fontFamily="$silkscreen">Docs &raquo;</Button.Text>
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
      borderWidth={1}
      borderColor="$borderColor"
      elevation="$1"
      width="100%"
      rounded="$4"
      overflow="hidden"
      height={305}
      self="center"
      x={0}
      flexDirection="row-reverse"
    >
      <YStack
        ref={container}
        position="relative"
        items="center"
        justify="center"
        width="60%"
        $sm={{ width: '100%' }}
      >
        <YStack fullscreen z={-1} bg="$background" opacity={0.5} />
        {isIntersecting ? (
          <AnimationsDemo position={positionI} animation={animation.animation} />
        ) : null}
      </YStack>

      <Separator vertical />

      <YStack position="relative" $sm={{ display: 'none' }} width="40%">
        <YStack flex={1} bg="$color1">
          {animationDescriptions.map((item, i) => {
            const isActive = item === animation
            return (
              <ListItem
                key={item.name}
                theme={isActive ? 'accent' : null}
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

        <XStack bg="$background" p="$4" items="center" justify="center">
          {/* @ts-ignore */}
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

export function AnimationsDemoBase(props) {
  const [positionI, setPositionI] = useControllableState({
    strategy: 'most-recent-wins',
    prop: props.position,
    defaultProp: 0,
  })
  const position = positions[positionI]
  const onPress = useEvent(() => {
    setPositionI((x) => {
      return (x + 1) % positions.length
    })
  })

  return (
    <>
      <Square
        transition={props.animation || 'bouncy'}
        animateOnly={['transform']}
        onPress={onPress}
        size={104}
        borderColor="$borderColor"
        borderWidth={1}
        rounded="$9"
        bg="$color9"
        hoverStyle={{
          scale: 1.5,
        }}
        pressStyle={{
          scale: 0.9,
        }}
        {...position}
      >
        {props.children || <LogoIcon downscale={0.75} />}
      </Square>

      <Button
        position="absolute"
        b={20}
        l={20}
        icon={Play}
        theme={props.tint}
        size="$5"
        circular
        onPress={onPress}
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
