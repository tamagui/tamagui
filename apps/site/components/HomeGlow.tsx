import { useTint } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import type { ThemeName } from 'tamagui'
import { YStack, isClient, useDebounce } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

const positions = new Array(15).fill(0).map(() => {
  return [
    Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
    Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
  ]
})

export const HomeGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const [index, setIndex] = useState(0)
  const isAtTop = index <= 1
  const isOnHeroBelow = isAtTop
  const [scrollTop, setScrollTopRaw] = useState(0)
  const setScrollTop = useDebounce(setScrollTopRaw, 200)
  const xs = 400
  const scale = isOnHeroBelow ? 2 : 1.4

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
        {[tint, tintAlt].map((cur, i) => {
          const isOpposing = tintIndex % 2 === 0
          const xScale = isOpposing ? 0 : 1
          const active = isDouble ? i == 0 || i == 1 : cur === tint
          const isAlt = i === 1
          const xRand = isOnHeroBelow ? 0 : positions[i][0]
          const yRand = isOnHeroBelow ? 0 : positions[i][1]
          const x =
            xScale * (xRand + (isOnHeroBelow ? (isAlt ? -350 : 350) : isAlt ? -400 : 400))
          return (
            <YStack
              key={`${i}`}
              overflow="hidden"
              h="100vh"
              w={1000}
              fullscreen
              theme={cur as ThemeName}
              left={`calc(50vw - 500px)`}
              x={x}
              y={isOnHeroBelow ? 350 : yRand}
              scale={scale}
              className={'home-glow ' + (active ? ' active' : '')}
            />
          )
        })}
      </>
    )
  }, [scale, tint, tints])

  console.log('wtf', isOnHeroBelow)

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      contain="layout"
      pe="none"
      animation="quicker"
      key={0}
      zi={0}
      x={0}
      // o={isOnHeroBelow ? 0.5 : 1}
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
