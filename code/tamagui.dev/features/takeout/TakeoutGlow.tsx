import { useTint } from '@tamagui/logo'
import { memo, useMemo } from 'react'
import { AnimatePresence, YStack } from 'tamagui'
import { useScrollPosition } from './useScrollProgress'

const glowPositions = [
  [-200, 420, 100],
  [-460, 128, 0],
  [424, 254, 0],
  [-270, 22, 0],
  [536, 122, 0],
  [-40, 290, 0],
  [672, 208, 0],
  [-282, 60, 0],
  [738, 196, 0],
  [-806, 2, 0],
  [678, 276, 0],
  [-84, 212, 0],
  [808, 172, 0],
  [-980, 120, 0],
  [310, 18, 0],
]

const glowScales = [
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

export const TakeoutGlow = memo(() => {
  const { tints, tint, tintAlt, tintIndex } = useTint()
  const rawScrollTop = useScrollPosition(100)
  const scrollTop = Math.min(rawScrollTop, 3000)
  const scale = 2.5

  const glows = useMemo(() => {
    return [
      tints[(tintIndex - 0) % tints.length],
      tints[(tintIndex + 1) % tints.length],
      tints[(tintIndex + 2) % tints.length],
    ].map((curTint, i) => {
      if (!curTint) return null

      const isOpposing = tintIndex % 2 === 0
      const isAlt = i === 1

      const xRand = glowPositions[(isOpposing ? 2 - i : i) % glowPositions.length][0]
      const yRand = glowPositions[(isOpposing ? 2 - i : i) % glowPositions.length][1]

      const x = xRand + (isAlt ? -300 : 300)

      return (
        <YStack
          key={`${i}${tint}${tintAlt}`}
          transition="superLazy"
          enterStyle={{
            opacity: 0,
          }}
          exitStyle={{
            opacity: 0,
          }}
          opacity={0.7}
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
          height="100vh"
          maxH={650}
          width={650}
          position="absolute"
          t={0}
          l={`calc(50vw - 500px)`}
          x={x}
          y={yRand + 250}
          scale={scale * (isAlt ? 0.5 : 1) * glowScales[tintIndex % glowScales.length][i]}
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
  }, [scale, tint, tints, tintIndex, tintAlt])

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      pointerEvents="none"
      overflow="hidden"
      z={0}
    >
      <YStack
        position="absolute"
        t={0}
        l={0}
        className="all ease-in-out s1"
        x={0}
        y={scrollTop}
        opacity={0.35}
      >
        <AnimatePresence>{glows}</AnimatePresence>
      </YStack>
    </YStack>
  )
})
