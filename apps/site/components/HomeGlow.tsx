import { useTint, useTintAlt } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import { ThemeName, YStack, isClient, useDebounce } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

export const HomeGlow = memo(() => {
  const { tints, tint, name, tintIndex } = useTint()
  const altTint = useTintAlt()
  const isHeroBelowColor = tint === 'blue' || tint === 'green' || tint === 'purple'
  const [index, setIndex] = useState(0)
  const isAtTop = index <= 1
  const isOnHeroBelow = isAtTop && isHeroBelowColor
  const [scrollTop, setScrollTopRaw] = useState(0)
  const setScrollTop = useDebounce(setScrollTopRaw, 200)
  const xs = 400
  const scale = isOnHeroBelow ? 2 : 1.2

  if (isClient) {
    useTintSectionIndex((index) => {
      setIndex(index)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const isDouble = true

  const glows = useMemo(() => {
    return (
      <>
        {[tint, altTint].map((cur, i) => {
          const isOpposing = tintIndex % 2 === 0
          const xScale = isOpposing ? 0 : 1
          const active = isDouble ? i == 0 || i == 1 : cur === tint
          const isAlt = i === 1
          const xRand = isOnHeroBelow
            ? 0
            : Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1)
          const yRand = isOnHeroBelow
            ? 0
            : Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1)
          return (
            <YStack
              key={`${i}`}
              overflow="hidden"
              h="100vh"
              w={1000}
              theme={cur as ThemeName}
              fullscreen
              left={`calc(50vw - 500px)`}
              x={
                xScale *
                (xRand + (isOnHeroBelow ? (isAlt ? -600 : 600) : isAlt ? -400 : 400))
              }
              y={yRand}
              scale={scale}
              className={'home-glow ' + (active ? ' active' : '')}
            />
          )
        })}
      </>
    )
  }, [scale, tint, tints])

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      contain="layout"
      pe="none"
      animation="quicker"
      key={0}
      zi={-1}
      x={0}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'lazy',
        x: tintIndex === 2 ? -xs : tintIndex === 4 ? xs : 0,
        y: -100,
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      {glows}
    </YStack>
  )
})
