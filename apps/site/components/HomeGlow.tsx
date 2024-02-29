import { useTint } from '@tamagui/logo'
import { cloneElement, memo, useEffect, useMemo, useState } from 'react'
import type { ThemeName } from 'tamagui'
import { YStack, isClient } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

const positions = new Array(15).fill(0).map(() => {
  return [
    Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
    Math.random() * 300 * (Math.random() > 0.5 ? 1 : -1),
  ]
})

export const HomeGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const [sectionIndex, setSectionIndex] = useState(0)
  const isAtTop = sectionIndex <= 1
  const isOnHeroBelow = isAtTop
  const [scrollTop, setScrollTop] = useState(0)
  const xs = 400
  const scale = isOnHeroBelow ? 2.3 : 4

  if (isClient) {
    useTintSectionIndex((index) => {
      setSectionIndex(index)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const isDouble = true

  const [history, setHistory] = useState<JSX.Element[][]>([])

  const glows = useMemo(() => {
    return [tint, tintAlt].map((cur, i) => {
      const isOpposing = tintIndex % 2 === 0
      const isAlt = i === 1
      const active = isDouble ? i == 0 || i == 1 : cur === tint
      const xRand = isOnHeroBelow ? 1 : positions[isOpposing ? 1 - i : i][0]
      const yRand = isOnHeroBelow ? 1 : positions[isOpposing ? 1 - i : i][1]
      const x = xRand + (isOnHeroBelow ? (isAlt ? -150 : 150) : isAlt ? -300 : 300)

      return (
        <YStack
          key={`${i}${history.length}`}
          overflow="hidden"
          h="100vh"
          w={1000}
          pos="absolute"
          t={0}
          l={0}
          theme={cur as ThemeName}
          left={`calc(50vw - 500px)`}
          x={x}
          y={isOnHeroBelow ? 350 : yRand + 250}
          scale={scale * (isAlt ? 0.5 : 1)}
          o={isAlt ? 0 : 1}
          className={'wander home-glow ' + (active ? ' active' : '')}
        />
      )
    })
  }, [scale, tint, tints])

  if (history[0] !== glows) {
    setHistory([glows, ...history])
  }
  if (history.length > 50) {
    setHistory([history[0], history[1]])
  }

  const lastGlows = history[1] || []

  const allGlows = [...glows, ...lastGlows]

  console.log('allGlows', allGlows)

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
      y={scrollTop}
      o={0.2}
      {...(isOnHeroBelow && {
        animation: 'lazy',
        x: sectionIndex === 2 ? -xs : sectionIndex === 4 ? xs : 0,
        y: -100,
        o: 0.1,
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      {allGlows?.map((glow, i) => {
        if (i >= 1) {
          return glow
        }
        // last glow
        return cloneElement(glow, {
          o: 0,
        })
      })}
    </YStack>
  )
})

// via radix-ui

import { useRef } from 'react'

export function usePrevious<T>(value: T) {
  const ref = useRef({ value, previous: value })

  // We compare values before making an update to ensure that
  // a change has been made. This ensures the previous value is
  // persisted correctly between renders.
  return useMemo(() => {
    if (ref.current.value !== value) {
      ref.current.previous = ref.current.value
      ref.current.value = value
    }
    return ref.current.previous
  }, [value])
}
