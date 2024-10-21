import { memo } from 'react'
import { YStack } from 'tamagui'
import { usePathname } from 'one'
import { themeTokenNumber } from '~/features/site/headerColors'

export const LayoutDecorativeStripe = memo(() => {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const y = isHome ? -48 : -78

  return (
    <YStack
      pos={isHome ? 'absolute' : ('fixed' as any)}
      zi={100000}
      t={0}
      l={0}
      r={0}
      h={150}
      theme="yellow"
      scaleY={-1}
      bg={`$color${themeTokenNumber.light}`}
      $theme-dark={{
        bg: `$color${themeTokenNumber.dark}`,
      }}
      y={y}
      $platform-web={{
        transition: `
          clip-path 400ms cubic-bezier(0.175, 0.885, 0.32, 2),
          transform 400ms cubic-bezier(0.175, 0.885, 0.32, 2)`,
        clipPath: isHome ? convex : concave,
      }}
    />
  )
})
const convex = getClipPath(0.15)[0]
const concave = getClipPath(0.1)[1]

function getClipPath(amplitude = 0.15) {
  const N = 200 // Number of points for smoothness
  const cx = 0.5 // Center x-coordinate (50%)
  const cy = 0.5 // Center y-coordinate (50%)
  const r = 0.5 // Radius (50%)

  // Generate points for the inverted arc (cutout at the top)
  const pointsTrue: string[] = []

  // Generate points for the regular arc (bulging out at the top)
  const pointsFalse: string[] = []

  // Start from the bottom-left corner
  pointsTrue.push('0% 100%')
  pointsFalse.push('0% 100%')

  // Bottom-right corner
  pointsTrue.push('100% 100%')
  pointsFalse.push('100% 100%')

  // Generate points along the arc from right to left
  for (let i = N - 1; i >= 0; i--) {
    const x = i / (N - 1)
    const dx = x - cx
    const dy = Math.sqrt(Math.max(r * r - dx * dx, 0))

    // Scale dy to adjust the amplitude
    const dyScaled = (dy / r) * amplitude

    // For the inverted arc (cutout at the top)
    const yTrue = cy + dyScaled

    // For the regular arc (bulging out at the top)
    const yFalse = cy - dyScaled

    const xPercent = (x * 100).toFixed(4) + '%'
    const yTruePercent = (yTrue * 100).toFixed(4) + '%'
    const yFalsePercent = (yFalse * 100).toFixed(4) + '%'

    pointsTrue.push(`${xPercent} ${yTruePercent}`)
    pointsFalse.push(`${xPercent} ${yFalsePercent}`)
  }

  // Top-left corner
  pointsTrue.push('0% 0%')
  pointsFalse.push('0% 0%')

  // Create the clipPath strings
  const clipPathTrue = `polygon(${pointsTrue.join(', ')})`
  const clipPathFalse = `polygon(${pointsFalse.join(', ')})`

  return [clipPathTrue, clipPathFalse]
}
