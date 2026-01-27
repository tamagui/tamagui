/**
 * Hook for cross-animation-driver toast drag animations.
 *
 * Animation strategy (all cross-driver):
 * - AnimatePresence => enter/exit styles
 * - transition prop => non-interactive styles (stacking, scale, opacity)
 * - useAnimatedNumber/Style => interactive styles (drag gestures only)
 *
 * This hook handles ONLY the drag gesture animations.
 * Uses the same pattern as Sheet for universal animation support.
 */

import { useConfiguration, useEvent, View as TamaguiView } from '@tamagui/core'
import type { Animated } from 'react-native'

export interface UseToastAnimationsOptions {
  /**
   * Called when exit animation completes
   */
  onExitComplete?: () => void
}

export interface ToastAnimationValues {
  /** set drag offset directly (no animation, for gesture moves) */
  setDragOffset: (x: number, y: number) => void
  /** spring back to origin after cancelled drag */
  springBack: (onComplete?: () => void) => void
  /** animate out in a direction after successful swipe */
  animateOut: (
    direction: 'left' | 'right' | 'up' | 'down',
    onComplete?: () => void
  ) => void
  /** stop any running animations */
  stop: () => void
  /** the animated style to spread on the AnimatedView */
  animatedStyle: any
  /** the animated view component from the driver */
  AnimatedView: typeof Animated.View
}

const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
  mass: 0.8,
}

const EXIT_DISTANCE = 200

export function useToastAnimations(
  options: UseToastAnimationsOptions = {}
): ToastAnimationValues {
  const { onExitComplete } = options

  const { animationDriver } = useConfiguration()

  if (!animationDriver) {
    throw new Error('Toast requires an animation driver to be set in TamaguiProvider')
  }

  const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver
  const AnimatedView = (animationDriver.View ?? TamaguiView) as typeof Animated.View

  // animated values for drag translation only
  const translateX = useAnimatedNumber(0)
  const translateY = useAnimatedNumber(0)

  // create animated transform style for drag
  const animatedStyle = useAnimatedNumberStyle(translateX, (x) => {
    'worklet'
    const y = translateY.getValue()
    return {
      transform: [{ translateX: x }, { translateY: y }],
    }
  })

  // set drag offset directly (no animation) - used during gesture
  const setDragOffset = useEvent((x: number, y: number) => {
    translateX.setValue(x, { type: 'direct' })
    translateY.setValue(y, { type: 'direct' })
  })

  // spring back to origin after cancelled drag
  const springBack = useEvent((onComplete?: () => void) => {
    translateX.setValue(0, SPRING_CONFIG)
    translateY.setValue(0, SPRING_CONFIG, onComplete)
  })

  // animate out in a direction after successful swipe
  const animateOut = useEvent(
    (direction: 'left' | 'right' | 'up' | 'down', onComplete?: () => void) => {
      const exitX =
        direction === 'left' ? -EXIT_DISTANCE : direction === 'right' ? EXIT_DISTANCE : 0
      const exitY =
        direction === 'up' ? -EXIT_DISTANCE : direction === 'down' ? EXIT_DISTANCE : 0

      const exitConfig = {
        type: 'spring' as const,
        damping: 25,
        stiffness: 200,
      }

      translateX.setValue(exitX, exitConfig)
      translateY.setValue(exitY, exitConfig, () => {
        onComplete?.()
        onExitComplete?.()
      })
    }
  )

  const stop = useEvent(() => {
    translateX.stop()
    translateY.stop()
  })

  return {
    setDragOffset,
    springBack,
    animateOut,
    stop,
    animatedStyle,
    AnimatedView,
  }
}
