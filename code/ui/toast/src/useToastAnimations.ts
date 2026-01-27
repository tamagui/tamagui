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
 *
 * NOTE: For CSS driver, we use a ref-based approach with direct DOM manipulation
 * because CSS driver's useAnimatedNumberStyle doesn't reactively update.
 * For Motion/Reanimated drivers, we use the AnimatedView + motionValue pattern.
 */

import { isWeb } from '@tamagui/constants'
import { useConfiguration, useEvent, View as TamaguiView } from '@tamagui/core'
import * as React from 'react'
import type { Animated } from 'react-native'

export interface UseToastAnimationsOptions {
  /**
   * Called when exit animation completes
   */
  onExitComplete?: () => void
  /**
   * When true, animations complete instantly (accessibility)
   */
  reducedMotion?: boolean
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
  /** the animated style to spread on the AnimatedView (for motion/reanimated drivers) */
  animatedStyle: any
  /** the animated view component from the driver */
  AnimatedView: typeof Animated.View
  /** ref to attach to the drag wrapper element (for CSS driver direct DOM updates) */
  dragRef: React.RefObject<HTMLDivElement | null>
}

const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 20,
  stiffness: 300,
  mass: 0.8,
}

const EXIT_DISTANCE = 200

// simple spring animation for CSS driver
function animateSpring(
  element: HTMLElement,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  config: { damping?: number; stiffness?: number; mass?: number },
  onComplete?: () => void
) {
  const { damping = 20, stiffness = 300, mass = 0.8 } = config

  let x = fromX
  let y = fromY
  let velocityX = 0
  let velocityY = 0
  let animationId: number | null = null
  const targetX = toX
  const targetY = toY

  function step() {
    // spring physics
    const forceX = -stiffness * (x - targetX)
    const forceY = -stiffness * (y - targetY)
    const dampingForceX = -damping * velocityX
    const dampingForceY = -damping * velocityY

    const accelerationX = (forceX + dampingForceX) / mass
    const accelerationY = (forceY + dampingForceY) / mass

    velocityX += accelerationX * 0.016 // ~60fps
    velocityY += accelerationY * 0.016
    x += velocityX * 0.016
    y += velocityY * 0.016

    element.style.transform = `translate3d(${x}px, ${y}px, 0)`

    // check if close enough to target and velocity is low
    const distanceX = Math.abs(x - targetX)
    const distanceY = Math.abs(y - targetY)
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY)

    if (distanceX < 0.5 && distanceY < 0.5 && speed < 0.5) {
      element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      onComplete?.()
      return
    }

    animationId = requestAnimationFrame(step)
  }

  animationId = requestAnimationFrame(step)

  return () => {
    if (animationId) {
      cancelAnimationFrame(animationId)
    }
  }
}

export function useToastAnimations(
  options: UseToastAnimationsOptions = {}
): ToastAnimationValues {
  const { onExitComplete, reducedMotion } = options

  const { animationDriver } = useConfiguration()

  if (!animationDriver) {
    throw new Error('Toast requires an animation driver to be set in TamaguiProvider')
  }

  const { useAnimatedNumber, useAnimatedNumberStyle } = animationDriver
  const AnimatedView = (animationDriver.View ?? TamaguiView) as typeof Animated.View

  // ref for direct DOM manipulation (CSS driver fallback)
  const dragRef = React.useRef<HTMLDivElement>(null)
  const cancelAnimationRef = React.useRef<(() => void) | null>(null)
  const currentOffsetRef = React.useRef({ x: 0, y: 0 })

  // On web, always use direct DOM manipulation for drag gestures.
  // This is because:
  // 1. CSS driver doesn't provide reactive animated style updates
  // 2. Reanimated driver's AnimatedView doesn't work well with raw div on web
  // 3. Direct DOM manipulation provides the most consistent and performant behavior
  // On native, we use the animation driver's AnimatedView + animatedStyle
  const useDirectDom = isWeb

  // animated values for drag translation (used by motion/reanimated drivers)
  const translateX = useAnimatedNumber(0)
  const translateY = useAnimatedNumber(0)

  // create animated transform style for drag (motion/reanimated only)
  const animatedStyle = useAnimatedNumberStyle(translateX, (x) => {
    'worklet'
    const y = translateY.getValue()
    return {
      transform: [{ translateX: x }, { translateY: y }],
    }
  })

  // set drag offset directly (no animation) - used during gesture
  const setDragOffset = useEvent((x: number, y: number) => {
    currentOffsetRef.current = { x, y }

    if (useDirectDom && dragRef.current) {
      // direct DOM manipulation for CSS driver
      dragRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
    } else {
      // use animation driver for motion/reanimated
      translateX.setValue(x, { type: 'direct' })
      translateY.setValue(y, { type: 'direct' })
    }
  })

  // spring back to origin after cancelled drag
  const springBack = useEvent((onComplete?: () => void) => {
    // cancel any running animation
    cancelAnimationRef.current?.()

    if (reducedMotion) {
      // instant for reduced motion
      if (useDirectDom && dragRef.current) {
        dragRef.current.style.transform = 'translate3d(0px, 0px, 0)'
      } else {
        translateX.setValue(0, { type: 'direct' })
        translateY.setValue(0, { type: 'direct' })
      }
      currentOffsetRef.current = { x: 0, y: 0 }
      onComplete?.()
      return
    }

    if (useDirectDom && dragRef.current) {
      // use JS spring animation for CSS driver
      const { x, y } = currentOffsetRef.current
      cancelAnimationRef.current = animateSpring(
        dragRef.current,
        x,
        y,
        0,
        0,
        SPRING_CONFIG,
        () => {
          currentOffsetRef.current = { x: 0, y: 0 }
          onComplete?.()
        }
      )
    } else {
      // use animation driver for motion/reanimated
      translateX.setValue(0, SPRING_CONFIG)
      translateY.setValue(0, SPRING_CONFIG, onComplete)
    }
  })

  // animate out in a direction after successful swipe
  const animateOut = useEvent(
    (direction: 'left' | 'right' | 'up' | 'down', onComplete?: () => void) => {
      // cancel any running animation
      cancelAnimationRef.current?.()

      const exitX =
        direction === 'left' ? -EXIT_DISTANCE : direction === 'right' ? EXIT_DISTANCE : 0
      const exitY =
        direction === 'up' ? -EXIT_DISTANCE : direction === 'down' ? EXIT_DISTANCE : 0

      if (reducedMotion) {
        // instant for reduced motion
        if (useDirectDom && dragRef.current) {
          dragRef.current.style.transform = `translate3d(${exitX}px, ${exitY}px, 0)`
        } else {
          translateX.setValue(exitX, { type: 'direct' })
          translateY.setValue(exitY, { type: 'direct' })
        }
        onComplete?.()
        onExitComplete?.()
        return
      }

      const exitConfig = {
        damping: 25,
        stiffness: 200,
        mass: 0.8,
      }

      if (useDirectDom && dragRef.current) {
        // use JS spring animation for CSS driver
        const { x, y } = currentOffsetRef.current
        cancelAnimationRef.current = animateSpring(
          dragRef.current,
          x,
          y,
          exitX,
          exitY,
          exitConfig,
          () => {
            onComplete?.()
            onExitComplete?.()
          }
        )
      } else {
        // use animation driver for motion/reanimated
        translateX.setValue(exitX, { type: 'spring', ...exitConfig })
        translateY.setValue(exitY, { type: 'spring', ...exitConfig }, () => {
          onComplete?.()
          onExitComplete?.()
        })
      }
    }
  )

  const stop = useEvent(() => {
    cancelAnimationRef.current?.()
    translateX.stop()
    translateY.stop()
  })

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      cancelAnimationRef.current?.()
    }
  }, [])

  return {
    setDragOffset,
    springBack,
    animateOut,
    stop,
    animatedStyle,
    AnimatedView,
    dragRef,
  }
}
