import type { Heading, TextProps } from 'tamagui'
import { memo, useState, useEffect } from 'react'
import { Circle, H1, useDidFinishSSR, AnimatePresence } from 'tamagui'

export default () => {
  return (
    <>
      {/* <Circle transition="medium" size={200} bg="red" opacity="enter:0" y="enter:-100px" /> */}

      <AnimatePresence mode="wait">
        <AnimatedHeading family="mono" index={0} Component={H1} color="red10">
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
          transition="lazy"
          o="1 enter:0 exit:0"
          y="0 enter:-100px exit:100px"
          pr="1"
          my="1"
          // @ts-ignore
          fontFamily={family}
          textShadowColor="shadow2"
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
