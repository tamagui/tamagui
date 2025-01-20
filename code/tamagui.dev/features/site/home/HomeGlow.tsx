import { useTint } from '@tamagui/logo'
import { memo, useMemo, useState } from 'react'
import { AnimatePresence, YStack, isClient } from 'tamagui'

import { useTintSectionIndex } from './TintSection'

const positions = [
  [-100 * 2, 420 * 1.5, 100],
  [-230 * 2, 64 * 1.5, 0],
  [212 * 2, 127 * 1.5, 0],
  [-135 * 2, 11 * 1.5, 0],
  [268 * 2, 61 * 1.5, 0],
  [-20 * 2, 145 * 1.5, 0],
  [336 * 2, 104 * 1.5, 0],
  [-141 * 2, 30 * 1.5, 0],
  [369 * 2, 98 * 1.5, 0],
  [-403 * 2, 1 * 1.5, 0],
  [339 * 2, 138 * 1.5, 0],
  [-42 * 2, 106 * 1.5, 0],
  [404 * 2, 86 * 1.5, 0],
  [-490 * 2, 60 * 1.5, 0],
  [155 * 2, 9 * 1.5, 0],
]

const scales = [
  [0.91, 1.05, 1.08],
  [0.92, 1.03, 1.07],
  [0.93, 1.04, 1.09],
  [0.94, 1.02, 1.06],
  [0.95, 1.01, 1.1],
  [0.96, 1.0, 1.05],
  [0.97, 1.06, 1.04],
  [0.98, 1.07, 1.03],
  [0.99, 1.08, 1.02],
  [1.0, 1.09, 1.01],
  [1.01, 1.1, 0.99],
  [1.02, 1.05, 0.98],
  [1.03, 1.04, 0.97],
  [1.04, 1.03, 0.96],
  [1.05, 1.02, 0.95],
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
    return [
      tints[(tintIndex - 0) % tints.length],
      tints[(tintIndex + 1) % tints.length],
      tints[(tintIndex + 2) % tints.length],
    ].map((curTint, i) => {
      const isOpposing = tintIndex % 2 === 0
      const isAlt = i === 1
      const xRand = isOnHeroBelow ? 1 : positions[isOpposing ? 2 - i : i][0]
      const yRand = isOnHeroBelow ? 1 : positions[isOpposing ? 2 - i : i][1]
      const heroBelowShift = tintIndex === 2 ? -100 : tintIndex === 4 ? 100 : 0
      const x =
        xRand +
        (isOnHeroBelow ? heroBelowShift + (isAlt ? -250 : 250) : isAlt ? -300 : 300)

      return (
        <YStack
          key={`${i}${tint}${tintAlt}`}
          animation="superLazy"
          enterStyle={{
            opacity: isOnHeroBelow ? 0.33 : 0,
          }}
          exitStyle={{
            opacity: 0,
          }}
          o={isOnHeroBelow ? 0.35 : 0.4}
          mixBlendMode={
            i === 0
              ? 'hard-light'
              : i === 1
                ? 'color-burn'
                : i === 2
                  ? 'exclusion'
                  : 'hue'
          }
          overflow="hidden"
          h="100vh"
          mah={650}
          w={650}
          pos="absolute"
          t={0}
          l={0}
          left={`calc(50vw - 500px)`}
          x={x}
          y={isOnHeroBelow ? 350 : yRand + 250}
          scale={scale * (isAlt ? 0.5 : 1) * scales[tintIndex][i]}
          scaleX={isOpposing ? 1 : 1}
        >
          <YStack
            fullscreen
            style={{
              background: `radial-gradient(var(--${curTint}7) 20%, transparent 50%)`,
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
      o={0.3}
      {...(isOnHeroBelow && {
        // animation: 'superLazy',
        x: sectionIndex === 2 ? -xs : sectionIndex === 4 ? xs : 0,
        y: -100,
        o: 0.24,
      })}
      // display={isResizing ? 'none' : 'flex'}
    >
      <AnimatePresence>{glows}</AnimatePresence>
    </YStack>
  )
})
