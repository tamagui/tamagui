import { useTint } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import { AnimatePresence, YStack, isClient } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

const positions = [
  [-10, 120],
  [-230, 64],
  [212, 127],
  [-135, 11],
  [268, 61],
  [-20, 145],
  [336, 104],
  [-141, 30],
  [369, 98],
  [-403, 1],
  [339, 138],
  [-42, 106],
  [404, 86],
  [-490, 60],
  [155, 9],
]

export const HomeGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const [sectionIndex, setSectionIndex] = useState(0)
  const isOnHeroBelow = sectionIndex <= 1
  const [scrollTop, setScrollTop] = useState(0)
  const xs = 400
  const scale = isOnHeroBelow ? 2 : 3

  if (isClient) {
    useTintSectionIndex((index) => {
      setSectionIndex(index)
      // const dims = tintSectionDimensions[index]
      // console.log('index', index, dims)
      const sy = document.documentElement?.scrollTop ?? 0
      setScrollTop(sy + 100)
    })
  }

  const glows = useMemo(() => {
    return [tint, tintAlt].map((cur, i) => {
      const isOpposing = tintIndex % 2 === 0
      const isAlt = i === 1
      const xRand = isOnHeroBelow ? 1 : positions[isOpposing ? 1 - i : i][0]
      const yRand = isOnHeroBelow ? 1 : positions[isOpposing ? 1 - i : i][1]
      const heroBelowShift = tintIndex === 2 ? -100 : tintIndex === 4 ? 100 : 0
      const x =
        xRand +
        (isOnHeroBelow ? heroBelowShift + (isAlt ? -250 : 250) : isAlt ? -300 : 300)

      return (
        <YStack
          key={`${i}${tint}${tintAlt}`}
          animation="superLazy"
          enterStyle={{
            opacity: isOnHeroBelow ? 0.5 : 0,
          }}
          exitStyle={{
            opacity: 0,
          }}
          overflow="hidden"
          h="100vh"
          mah={1000}
          w={1000}
          pos="absolute"
          t={0}
          l={0}
          left={`calc(50vw - 500px)`}
          x={x}
          y={isOnHeroBelow ? 350 : yRand + 250}
          scale={scale * (isAlt ? 0.5 : 1)}
          scaleX={isOpposing ? 1 : 1.3}
        >
          <YStack
            fullscreen
            style={{
              background: `radial-gradient(var(--${cur}7) 0%, transparent 50%)`,
              transition: `all ease-in-out 1000ms`,
            }}
          />
        </YStack>
      )
    })
  }, [scale, tint, tints])

  return (
    <YStack
      pos="absolute"
      t={0}
      l={0}
      pe="none"
      className="all ease-in-out s1"
      key={0}
      zi={0}
      x={0}
      y={scrollTop}
      o={0.4}
      {...(isOnHeroBelow && {
        // animation: 'superLazy',
        x: sectionIndex === 2 ? -xs : sectionIndex === 4 ? xs : 0,
        y: -100,
        o: 0.4,
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      <AnimatePresence>{glows}</AnimatePresence>
    </YStack>
  )
})
