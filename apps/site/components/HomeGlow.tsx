import { tints } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import { YStack, isClient, useDebounce, useWindowDimensions } from 'tamagui'

import { useTintSectionIndex } from './TintSection'
import { useTint } from './useTint'

export const HomeGlow = memo(({ top }: { top: number }) => {
  const { tint } = useTint()
  const isHeroBelowColor = tint === 'blue' || tint === 'green' || tint === 'purple'
  const [index, setIndex] = useState(0)
  const isAtTop = index <= 1
  const isOnHeroBelow = isAtTop && isHeroBelowColor
  const [scrollTop, setScrollTopRaw] = useState(0)
  const setScrollTop = useDebounce(setScrollTopRaw, 200)
  const windowWidth = useWindowDimensions().width
  const xs = Math.min(400, windowWidth * 0.25)
  const scale = isOnHeroBelow ? 0.5 : 1

  if (isClient) {
    useTintSectionIndex((index) => {
      setIndex(index)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const glows = useMemo(() => {
    return (
      <>
        {tints.map((cur) => {
          return (
            <YStack
              key={cur}
              overflow="hidden"
              h="100vh"
              w={1000}
              theme={cur}
              o={cur === tint ? 0.5 : 0}
              fullscreen
              left="calc(50vw - 500px)"
              scale={scale}
              className="hero-blur all linear s2"
            />
          )
        })}
      </>
    )
  }, [scale, tint])

  return (
    <YStack
      pos="absolute"
      t={0}
      contain="layout"
      l={0}
      pe="none"
      animation="lazy"
      key={0}
      zi={-1}
      x={0}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'quick',
        x: tint === 'green' ? -xs : tint === 'purple' ? xs : 0,
        y: top,
      })}
    >
      {glows}
    </YStack>
  )
})
