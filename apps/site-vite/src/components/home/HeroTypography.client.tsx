import { AnimatePresence } from '@tamagui/animate-presence'
import { useIsIntersecting } from '@tamagui/demos'
import { useEffect, useRef, useState } from 'react'
import { H1, H2, H3, H4, H5, H6, Heading, TextProps, YStack } from 'tamagui'

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
    <YStack ref={ref}>
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
        <AnimatedHeading key={`${family}6`} index={5} Component={H6} family={family} color="$red10">
          font themes
        </AnimatedHeading>
      </AnimatePresence>
    </YStack>
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
