import { AnimatePresence } from '@tamagui/animate-presence'
import { memo, useEffect, useRef, useState } from 'react'
import type { Heading, TextProps } from 'tamagui'
import { Button, Card, H1, H2, Paragraph, XStack, YStack, useDidFinishSSR } from 'tamagui'

const families = ['silkscreen', 'mono', 'heading']

export const HeroTypography = memo(() => {
  const [family, setFamily] = useState(`silkscreen`)
  const ref = useRef<any>()
  const isIntersecting = false

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
      <YStack fullscreen className="" o={0.1} />
      {/* -5 my to fir grid nicely */}
      <YStack my={-5} position="relative" space="$8">
        <YStack ref={ref} ai="center" space="$3">
          <H2>
            Beautifully expressive font systems with{' '}
            <span className="clip-text rainbow">rhythm</span>.
          </H2>
        </YStack>

        <XStack
          ai="center"
          jc="center"
          pos="relative"
          gap="$8"
          flexDirection="row-reverse"
          $sm={{
            flexDirection: 'column-reverse',
          }}
        >
          <OverlayCard />

          <YStack
            h={300}
            w="40%"
            gap="$0.5"
            jc="center"
            scale={1.1}
            x={-20}
            y={5}
            $sm={{ y: 0, miw: '110%', ai: 'center', x: 0, scale: 0.9 }}
          >
            <YStack ai="flex-end" h={270}>
              <AnimatePresence exitBeforeEnter>
                <AnimatedHeading
                  debug
                  key={`${family}1`}
                  index={0}
                  Component={H1}
                  family={family}
                  color="$pink10"
                >
                  Swappable
                </AnimatedHeading>
                {/* <AnimatedHeading
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
                </AnimatedHeading> */}
              </AnimatePresence>
            </YStack>
          </YStack>
        </XStack>
      </YStack>
    </>
  )
})

const OverlayCard = () => {
  // {/* TODO elevation not overriding? */}
  return (
    <Card bw={1} bc="$borderColor" br="$6" elevation="$6" shadowRadius={60}>
      <YStack
        jc="center"
        p="$6"
        space="$5"
        maw="calc(min(90vw, 400px))"
        $sm={{ p: '$5' }}
      >
        <Paragraph ta="left" size="$8" fow="400" ls={-1}>
          Use, swap and share fonts with typed vertical rhythm.
        </Paragraph>

        <Paragraph ta="left" size="$6" theme="alt2" fow="400">
          Typed, sizable fonts with control over every facet - weight, spacing,
          line-height, letter-spacing, color and more.
        </Paragraph>

        <Button aria-label="Fonts docs" fontFamily="$silkscreen" als="flex-end">
          Fonts &raquo;
        </Button>
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
          animation={disableAnimation ? null : 'lazy'}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          o={1}
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
          ellipse
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
