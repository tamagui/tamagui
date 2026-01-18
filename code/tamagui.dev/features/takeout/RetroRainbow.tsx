import { YStack } from 'tamagui'
import { isSafari } from './helpers'
import { useScrollProgress } from './useScrollProgress'

export const RetroRainbow = () => {
  const RAINBOW_SCROLL_START = 3500
  const RAINBOW_SCROLL_END = RAINBOW_SCROLL_START + 400
  const scrollProgress = isSafari()
    ? 1
    : useScrollProgress(RAINBOW_SCROLL_START, RAINBOW_SCROLL_END)

  const easeOutCubic = (t: number) => 1 - (1 - t) ** 3
  const easedProgress = isSafari() ? 1 : easeOutCubic(scrollProgress)

  const bands = [
    { color: '#C94A4A', size: 448 },
    { color: '#E07B4C', size: 414 },
    { color: '#E8A84C', size: 381 },
    { color: '#F0D264', size: 347 },
    { color: '#7EC87E', size: 314 },
    { color: '#5BC4C4', size: 280 },
    { color: '#7BA3D4', size: 246 },
    { color: '#9B6EB8', size: 213 },
  ]

  return (
    <YStack position="relative" height={0} overflow="visible">
      {bands.map((band, i) => (
        <YStack
          key={i}
          position="absolute"
          r={-band.size / 2 - 150}
          t={-band.size / 2 + 100}
          width={band.size}
          height={band.size}
          opacity={easedProgress * 0.07}
          className="ease-out ms500 all"
          pointerEvents="none"
          z={-1}
          style={{
            borderRadius: '50%',
            border: `25px solid ${band.color}`,
            background: 'transparent',
            transform: `scale(${0.9 + easedProgress * 0.1})`,
          }}
        />
      ))}
    </YStack>
  )
}
