import Link from 'next/link'
import { useEffect, useState } from 'react'
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
  TextProps,
  XStack,
  YStack,
} from 'tamagui'

import { AnimatePresence } from '../../animate-presence'
import { useTint } from './ColorToggleButton'
import { ContainerLarge } from './Container'
import { HomeH2 } from './HomeH2'

const families = ['silkscreen', 'mono', 'inter']

export const HeroTypography = () => {
  const [family, setFamily] = useState(`silkscreen`)

  useEffect(() => {
    const tm = setInterval(() => {
      setFamily((cur) => {
        return families[(families.indexOf(cur) + 1) % families.length]
      })
    }, 3000)

    return () => {
      clearInterval(tm)
    }
  }, [])

  return (
    <>
      <YStack fullscreen className="bg-grid-big mask-gradient-both" o={0.5} />
      {/* <YStack theme="alt2" fullscreen className="hero-gradient-white mask-gradient-down" /> */}
      <ContainerLarge position="relative" space="$8">
        <YStack ai="center" space="$2">
          <HomeH2>Plug-and-play fonts, individually tuned.</HomeH2>
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
            mt={40}
            space="$0.5"
            ai="flex-end"
            scale={1.2}
            x={-40}
            $sm={{ miw: '110%', ai: 'center', x: 0, scale: 0.8 }}
          >
            <AnimatePresence exitBeforeEnter>
              <AnimatedHeading
                key={`${family}1`}
                index={0}
                Component={H1}
                family={family}
                color="$pink10"
              >
                Hot-swappable
              </AnimatedHeading>
              <AnimatedHeading
                key={`${family}2`}
                index={1}
                Component={H2}
                family={family}
                color="$purple10"
              >
                individually-styled
              </AnimatedHeading>
              <AnimatedHeading
                key={`${family}3`}
                index={2}
                Component={H3}
                family={family}
                color="$blue10"
              >
                typed and optimized
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
      <YStack jc="center" p="$6" space="$4" maw="calc(min(90vw, 400px))">
        <Paragraph ta="left" size="$8" fow="400">
          Every font prop tuned at every size across weight, spacing, line height, and more.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          Each font family can define independent styles for everything from weight to spacing,
          unique to each font size.
        </Paragraph>

        <Paragraph ta="left" size="$5" theme="alt2">
          This enables fully-typed, shareable fonts as easy as an npm install.
        </Paragraph>

        <Link href="/docs/intro/configuration" passHref>
          <Button fontFamily="$silkscreen" tag="a" als="flex-end" theme={tint}>
            Learn more &raquo;
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
    <Delay by={index * 200}>
      <Component
        animation="bouncy"
        enterStyle={{ o: 0, y: -10 }}
        exitStyle={{ o: 0, y: 10 }}
        o={1}
        y={0}
        fontFamily={`$${family}`}
        textShadowColor="$background"
        textShadowRadius={10}
        textShadowOffset={{ width: 0, height: 5 }}
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
