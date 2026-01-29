import { AnimatePresence } from '@tamagui/animate-presence'
import { useIsIntersecting } from '~/hooks/useOnIntersecting'
import { useTint } from '@tamagui/logo'
import { Link } from '~/components/Link'
import { memo, useEffect, useRef, useState } from 'react'
import type { Heading, TextProps } from 'tamagui'
import {
  Button,
  Card,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Paragraph,
  XStack,
  YStack,
  useDidFinishSSR,
} from 'tamagui'

import { ContainerLarge } from '~/components/Containers'
import { HomeH2 } from './HomeHeaders'

const families = ['silkscreen', 'mono', 'heading']

export const HomeTypography = memo(() => {
  const [family, setFamily] = useState(`silkscreen`)
  const ref = useRef<any>(null)
  const isIntersecting = useIsIntersecting(ref)

  useEffect(() => {
    if (!isIntersecting) {
      return
    }
    const next = () => {
      setFamily((cur) => {
        return families[(families.indexOf(cur) + 1) % families.length]
      })
    }
    const tm = setInterval(next, 4200)
    next()
    return () => {
      clearInterval(tm)
    }
  }, [isIntersecting])

  return (
    <>
      <YStack fullscreen className="" opacity={0.1} />
      {/* -5 my to fit grid nicely */}
      <ContainerLarge my={-5} position="relative" gap="$8">
        <YStack ref={ref} items="center" gap="$3">
          <HomeH2>
            Beautifully expressive font systems with{' '}
            <span className="clip-text rainbow">rhythm</span>.
          </HomeH2>
        </YStack>

        <XStack
          items="center"
          justify="center"
          position="relative"
          gap="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'column-reverse',
          }}
        >
          <OverlayCard />

          <YStack
            height={300}
            width="40%"
            gap="$0.5"
            justify="center"
            scale={1.1}
            x={-20}
            y={5}
            $sm={{ y: 0, minW: '110%', items: 'center', x: 0, scale: 0.9 }}
          >
            <YStack items="flex-end" contain="paint layout" height={270}>
              <AnimatePresence exitBeforeEnter>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}1`}
                  index={0}
                  Component={H1}
                  family={family}
                  color="$red10"
                >
                  Swappable
                </AnimatedHeading>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}2`}
                  index={1}
                  Component={H2}
                  family={family}
                  color="$blue10"
                >
                  typed, compiled
                </AnimatedHeading>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}3`}
                  index={2}
                  Component={H3}
                  family={family}
                  color="$blue10"
                >
                  custom per-size
                </AnimatedHeading>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}4`}
                  index={3}
                  Component={H4}
                  family={family}
                  color="$green10"
                >
                  premade or custom
                </AnimatedHeading>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}5`}
                  index={4}
                  Component={H5}
                  family={family}
                  color="$yellow10"
                >
                  easy to author
                </AnimatedHeading>
                <AnimatedHeading
                  disableAnimation={!isIntersecting}
                  key={`${family}6`}
                  index={5}
                  Component={H6}
                  family={family}
                  color="$red10"
                >
                  font themes
                </AnimatedHeading>
              </AnimatePresence>
            </YStack>
          </YStack>
        </XStack>
      </ContainerLarge>
    </>
  )
})

const OverlayCard = () => {
  const { tint } = useTint()

  // {/* TODO elevation not overriding? */}
  return (
    <Card
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$6"
      elevation="$6"
      shadowRadius={60}
    >
      <YStack
        justify="center"
        p="$6"
        gap="$5"
        maxW="calc(min(90vw, 400px))"
        $sm={{ p: '$5' }}
      >
        <Paragraph text="left" size="$8" fontWeight="400" letterSpacing={-1}>
          Use, swap and share fonts with typed vertical rhythm.
        </Paragraph>

        <Paragraph text="left" size="$6" color="$color9" fontWeight="400">
          Typed, sizable fonts with control over every facet - weight, spacing,
          line-height, letter-spacing, color and more.
        </Paragraph>

        <Link asChild href="/docs/core/configuration">
          <Button aria-label="Fonts docs" self="flex-end" theme={tint as any}>
            <Button.Text fontFamily="$silkscreen">Fonts &raquo;</Button.Text>
          </Button>
        </Link>
      </YStack>
    </Card>
  )
}

const AnimatedHeading = memo(
  ({
    disableAnimation,
    Component,
    children,
    family,
    index,
    ...rest
  }: {
    disableAnimation?: boolean
    family: string
    Component: typeof Heading
    children: any
    index: number
  } & TextProps) => {
    return (
      <Delay passThrough={disableAnimation} by={index * 180 + 20}>
        <Component
          transition={disableAnimation ? null : 'lazy'}
          enterStyle={{ opacity: 0, y: -10 }}
          exitStyle={{ opacity: 0, y: 10 }}
          opacity={1}
          y={0}
          pr="$1"
          my="$1"
          $sm={{
            pr: 0,
          }}
          // @ts-ignore
          fontFamily={`$${family}`}
          textShadowColor="$shadow2"
          textShadowRadius={3}
          textShadowOffset={{ width: 0, height: 3 }}
          ellipsis
          {...rest}
        >
          {children}
        </Component>
      </Delay>
    )
  }
)

const Delay = ({ children, by, passThrough }) => {
  const isMounted = useDidFinishSSR()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), by)
    return () => clearTimeout(showTimer)
  })

  if (passThrough) {
    return children
  }

  return !isMounted || !done ? null : children
}
