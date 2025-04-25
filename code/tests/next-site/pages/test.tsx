import type { Heading, TextProps } from 'tamagui'
import { memo, useState, useEffect } from 'react'
import { Circle, H1, useDidFinishSSR, AnimatePresence } from 'tamagui'

export default () => {
  return (
    <>
      {/* <Circle
        animation="medium"
        size={200}
        bg="red"
        enterStyle={{
          opacity: 0,
          y: -100,
        }}
      /> */}

      <AnimatePresence exitBeforeEnter>
        <AnimatedHeading index={0} Component={H1} color="$pink10">
          Swappable
        </AnimatedHeading>
      </AnimatePresence>
    </>
  )
}

const Delay = ({ children, by }) => {
  const isMounted = useDidFinishSSR()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const showTimer = setTimeout(() => setDone(true), by)
    return () => clearTimeout(showTimer)
  })

  const hidden = !isMounted || !done
  console.warn('render delay', hidden)

  return hidden ? null : children
}

const AnimatedHeading = memo(
  ({
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
      <Delay by={50}>
        <Component
          animation="lazy"
          enterStyle={{ o: 0, y: -100 }}
          exitStyle={{ o: 0, y: 100 }}
          o={1}
          y={0}
          pr="$1"
          my="$1"
          // $sm={{
          //   pr: 0,
          // }}
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
