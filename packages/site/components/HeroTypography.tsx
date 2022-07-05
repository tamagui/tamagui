import { AnimatePresence } from '@tamagui/animate-presence'
import { useIsIntersecting } from '@tamagui/demos'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Button,
  Card,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Heading,
  Paragraph,
  Spacer,
  TextProps,
  XStack,
  YStack,
} from 'tamagui'

import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2 } from './HomeH2'

const families = ['silkscreen', 'mono', 'inter']

export const HeroTypography = () => {
  const [family, setFamily] = useState(`silkscreen`)
  const ref = useRef<any>()
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
    const tm = setInterval(next, 4500)
    next()
    return () => {
      clearInterval(tm)
    }
  }, [isIntersecting])

  return (
    <>
      <YStack fullscreen className="bg-grid mask-gradient-both" o={0.1} />
      {/* -5 my to fir grid nicely */}
      <ContainerLarge my={-5} position="relative" space="$8">
        <YStack ref={ref} ai="center" space="$3">
          <HomeH2>
            Beautifully expressive font systems with{' '}
            <span className="clip-text rainbow">rythym</span>.
          </HomeH2>
        </YStack>

        <XStack
          ai="center"
          jc="center"
          pos="relative"
          space="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'column-reverse',
          }}
        >
          <OverlayCard />

          <YStack
            h={300}
            w="40%"
            space="$0.5"
            jc="center"
            scale={1.1}
            x={-20}
            y={-10}
            $sm={{ y: 0, miw: '110%', ai: 'center', x: 0, scale: 0.9 }}
          >
            <YStack ai="flex-end" h={270}>
              <AnimatePresence exitBeforeEnter>
                <AnimatedHeading
                  key={`${family}1`}
                  index={0}
                  Component={H1}
                  family={family}
                  color="$pink10"
                >
                  Swappable
                </AnimatedHeading>
                <AnimatedHeading
                  key={`${family}2`}
                  index={1}
                  Component={H2}
                  family={family}
                  color="$blue10"
                >
                  typed, compiled
                </AnimatedHeading>
                <AnimatedHeading
                  key={`${family}3`}
                  index={2}
                  Component={H3}
                  family={family}
                  color="$purple10"
                >
                  custom per-size
                </AnimatedHeading>
                <AnimatedHeading
                  key={`${family}4`}
                  index={3}
                  Component={H4}
                  family={family}
                  color="$green10"
                >
                  premade or custom
                </AnimatedHeading>
                <AnimatedHeading
                  key={`${family}5`}
                  index={4}
                  Component={H5}
                  family={family}
                  color="$orange10"
                >
                  easy to author
                </AnimatedHeading>
                <AnimatedHeading
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
}

const OverlayCard = () => {
  const { tint } = useTint()

  // {/* TODO elevation not overriding? */}
  return (
    <Card bw={1} boc="$borderColor" br="$6" elevation="$6" shadowRadius={60}>
      <YStack jc="center" p="$6" space="$5" maw="calc(min(90vw, 400px))" $sm={{ p: '$5' }}>
        <Paragraph ta="left" size="$8" fow="400" letsp={-1}>
          Use, swap and share fonts with typed vertical rhythm.
        </Paragraph>

        <Paragraph ta="left" size="$6" theme="alt2" fow="400">
          Typed, sizable fonts with control over every facet - weight, spacing, line-height,
          letter-spacing, color and more.
        </Paragraph>

        <Link href="/docs/intro/configuration" passHref>
          <Button
            accessibilityLabel="Fonts docs"
            fontFamily="$silkscreen"
            tag="a"
            als="flex-end"
            theme={tint}
          >
            Fonts &raquo;
          </Button>
        </Link>
      </YStack>
    </Card>
  )
}

const AnimatedHeading = ({
  Component,
  children,
  family,
  index,
  ...rest
}: {
  family: string
  Component: typeof Heading
  children: any
  index: number
} & TextProps) => {
  return (
    <Delay by={index * 180}>
      <Component
        animation="lazy"
        enterStyle={{ o: 0, y: -10 }}
        exitStyle={{ o: 0, y: 10 }}
        o={1}
        y={0}
        pr="$1"
        my="$1"
        $sm={{
          pr: 0,
        }}
        fontFamily={`$${family}`}
        textShadowColor="$shadowColorFocus"
        textShadowRadius={3}
        textShadowOffset={{ width: 0, height: 3 }}
        ellipse
        {...rest}
      >
        {children}
      </Component>
    </Delay>
  )
}

const Delay = ({ children, by }) => {
  const [done, setDone] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), by)
    return () => clearTimeout(showTimer)
  })

  return done ? children : null
}
