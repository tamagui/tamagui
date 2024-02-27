import { useTint } from '@tamagui/logo'
import { memo, useEffect, useMemo, useState } from 'react'
import type { ThemeName } from 'tamagui'
import { YStack, isClient, useDebounce, useForceUpdate } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

const positions = new Array(15).fill(0).map(() => {
  return [
    Math.random() * 350 * (Math.random() > 0.5 ? 1 : -1),
    Math.random() * 350 * (Math.random() > 0.5 ? 1 : -1),
  ]
})

export const HomeGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const [sectionIndex, setSectionIndex] = useState(0)
  const isAtTop = sectionIndex <= 1
  const isOnHeroBelow = isAtTop
  const [scrollTop, setScrollTop] = useState(0)
  const xs = 400
  const scale = isOnHeroBelow ? 2.3 : 2

  if (isClient) {
    useTintSectionIndex((index) => {
      setSectionIndex(index)
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
          const isAlt = i % 2 === 0
          const active = isDouble ? i == 0 || i == 1 : cur === tint
          const xRand = isOnHeroBelow ? 1 : positions[i][0]
          const yRand = isOnHeroBelow ? 1 : positions[i][1]
          const x = xRand + (isOnHeroBelow ? (isAlt ? -150 : 150) : isAlt ? -300 : 300)
          return (
            <YStack
              key={`${i}`}
              overflow="hidden"
              h="100vh"
              w={1000}
              pos="absolute"
              t={0}
              l={0}
              theme={cur as ThemeName}
              left={`calc(50vw - 500px)`}
              x={x}
              y={isOnHeroBelow ? 350 : yRand + 350}
              scale={scale}
              className={'wander home-glow ' + (active ? ' active' : '')}
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
      pe="none"
      animation="kindaBouncy"
      key={0}
      zi={0}
      x={0}
      // o={isOnHeroBelow ? 0.5 : 1}
      y={scrollTop}
      {...(isOnHeroBelow && {
        animation: 'lazy',
        x: sectionIndex === 2 ? -xs : sectionIndex === 4 ? xs : 0,
        y: -100,

        '$theme-dark': {
          o: 0.15,
        },
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      {glows}
    </YStack>
  )
})
