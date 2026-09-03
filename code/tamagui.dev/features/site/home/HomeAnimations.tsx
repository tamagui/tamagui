import { LogoIcon, useTint } from '@tamagui/logo'
import { Play } from '@tamagui/lucide-icons-2'
import React, { memo, useEffect, useRef, useState } from 'react'
import {
  ListItem,
  Paragraph,
  Separator,
  Square,
  XStack,
  YStack,
  useControllableState,
  useEvent,
} from 'tamagui'
import { Button } from '~/components/Button'
import { useIsIntersecting } from '~/hooks/useOnIntersecting'

export const AnimationsDemo = (props) => {
  const { tint } = useTint()
  return <AnimationsDemoBase tint={tint} {...props} />
}

const animationDescriptions = [
  {
    name: 'Bouncy',
    description: 'A bouncy spring',
    animation: 'bouncy',
    settings: {
      damping: 10,
      stiffness: 80,
      mass: 0.8,
    },
  },
  {
    name: 'Lazy',
    description: 'A slow, relaxed spring',
    animation: 'lazy',
    settings: {
      damping: 15,
      stiffness: 50,
      mass: 2,
    },
  },
  {
    name: 'Quick',
    description: 'A super fast spring',
    animation: 'quick',
    settings: {
      damping: 10,
      stiffness: 200,
      mass: 1,
    },
  },
] as const

let hasScrolledOnce = false

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
      borderColor="border-color"
      width="100%"
      rounded="4"
      overflow="hidden"
      height={305}
      self="center"
      x={0}
      flexDirection="row-reverse"
      elevation="1"
    >
      <YStack
        ref={container}
        position="relative"
        items="center"
        justify="center"
        width="60% sm:100%"
      >
        <YStack position="absolute" inset={0} z={-1} bg="background" opacity={0.5} />
        {isIntersecting ? (
          <AnimationsDemo position={positionI} animation={animation.animation} />
        ) : null}
      </YStack>

      <Separator vertical />

      <YStack position="relative" display="sm:none" width="40%">
        <YStack flex={1} bg="color1">
          {animationDescriptions.map((item, i) => {
            const isActive = item === animation
            return (
              <ListItem
                key={item.name}
                theme={isActive ? 'accent' : null}
                px="4"
                py="2"
                bg={isActive ? 'var(--color2)' : 'var(--color1)'}
                borderColor="var(--border-color)"
                cursor="pointer"
                title={item.name}
                subTitle={item.description}
                onPress={() => {
                  setAnimationI(i)
                  next()
                }}
              />
            )
          })}
        </YStack>

        <Separator />

        <XStack bg="background" p="4" items="center" justify="center">
          {/* @ts-ignore */}
          {settings.map(([key, value], i) => {
            if (key === 'type') {
              return null
            }
            return (
              <React.Fragment key={key}>
                <YStack>
                  <Paragraph size="2">{key}</Paragraph>
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
        transition={{ preset: props.animation || 'bouncy', properties: 'transform' }}
        borderColor="border-color"
        borderWidth={1}
        rounded="9"
        bg="color9"
        {...position}
        onPress={onPress}
        size={104}
      >
        {props.children || <LogoIcon downscale={0.75} />}
      </Square>

      <Button
        position="absolute"
        b={20}
        l={20}
        icon={Play}
        theme={props.tint}
        size="5"
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
    scale: '1 hover:1.5 press:0.9',
    rotate: '0deg',
  },
  {
    x: -50,
    y: -50,
    scale: '0.5 hover:0.6 press:0.4',
    rotate: '-45deg',
  },
  {
    x: 50,
    y: 50,
    scale: '1 hover:1.1 press:0.9',
    rotate: '180deg',
  },
]
