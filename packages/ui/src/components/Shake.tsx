import { useAnimationDriver } from '@tamagui/web'
import { useEffect } from 'react'

export const Shake = ({
  shakeKey,
  shakeTimes = 4,
  shakeDistance = 3,
  children,
}: {
  /**
   * animated the container when this value changes and reset when it's undefined
   * one great use-case is the error message of a field
   */
  shakeKey?: string
  /**
   * @default 4
   */
  shakeTimes?: number
  /**
   * @default 5
   */
  shakeDistance?: number
  children: React.ReactNode
}) => {
  const driver = useAnimationDriver()
  if (!driver) throw new Error('No driver found.')
  const {
    useAnimatedNumber,
    useAnimatedNumberStyle,
    View: AnimatedView,
  } = driver
  const animatedNumber = useAnimatedNumber(0)
  useEffect(() => {
    if (!shakeKey) {
      animatedNumber.setValue(0)
    } else {
      const timeouts = Array.from(Array(shakeTimes)).map((_, idx, arr) =>
        setTimeout(
          () =>
            animatedNumber.setValue(
              idx + 1 === arr.length
                ? 0
                : (idx + 1) % 2 === 0
                ? -shakeDistance
                : shakeDistance
            ),
          100 * idx
        )
      )
      return () => {
        for (const timeout of timeouts) {
          clearTimeout(timeout)
        }
      }
    }
  }, [animatedNumber, shakeDistance, shakeKey, shakeTimes])

  const animatedStyle = useAnimatedNumberStyle(animatedNumber, (val) => {
    'worklet'
    return {
      transform: [{ translateX: val }],
    }
  })
  return <AnimatedView style={animatedStyle}>{children}</AnimatedView>
}
