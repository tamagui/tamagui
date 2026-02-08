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
  /**
   * Primary swipe axis — determines which animated value is tracked for style updates.
   * 'horizontal' tracks translateX, 'vertical' tracks translateY.
   */
  swipeAxis?: 'horizontal' | 'vertical'
}

export interface ToastAnimationValues {
  /** set drag offset directly (no animation, for gesture moves) */
  setDragOffset: (x: number, y: number) => void
  /** spring back to origin after cancelled drag */
  springBack: (onComplete?: () => void) => void
  /** animate out in a direction after successful swipe, with optional velocity for smooth continuation */
  animateOut: (
    direction: 'left' | 'right' | 'up' | 'down',
    velocity?: number,
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

// tuned for snappy, premium feel like Sonner
const SPRING_CONFIG = {
  type: 'spring' as const,
  damping: 30,
  stiffness: 400,
  mass: 0.5,
}

const EXIT_DISTANCE = 200

// simple spring animation for CSS driver
function animateSpring(
  element: HTMLElement,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  config: {
    damping?: number
    stiffness?: number
    mass?: number
    initialVelocityX?: number
    initialVelocityY?: number
    fadeOut?: boolean
  },
  onComplete?: () => void
) {
  const {
    damping = 30,
    stiffness = 400,
    mass = 0.5,
    initialVelocityX = 0,
    initialVelocityY = 0,
    fadeOut = false,
  } = config

  let x = fromX
  let y = fromY
  // use initial velocity from gesture for smooth continuation
  let velocityX = initialVelocityX
  let velocityY = initialVelocityY
  let animationId: number | null = null
  const targetX = toX
  const targetY = toY

  // for fade out, track progress based on distance traveled
  const totalDistance = Math.sqrt((toX - fromX) ** 2 + (toY - fromY) ** 2) || 1

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

    // animate opacity based on progress toward target
    if (fadeOut) {
      const distanceTraveled = Math.sqrt((x - fromX) ** 2 + (y - fromY) ** 2)
      const progress = Math.min(distanceTraveled / totalDistance, 1)
      element.style.opacity = String(1 - progress)
    }

    // check if close enough to target and velocity is low
    const distanceX = Math.abs(x - targetX)
    const distanceY = Math.abs(y - targetY)
    const speed = Math.sqrt(velocityX * velocityX + velocityY * velocityY)

    if (distanceX < 0.5 && distanceY < 0.5 && speed < 0.5) {
      element.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`
      if (fadeOut) {
        element.style.opacity = '0'
      }
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
  const { onExitComplete, reducedMotion, swipeAxis = 'horizontal' } = options

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

  // create animated transform styles for drag (motion/reanimated only)
  // useAnimatedNumberStyle only tracks its first arg as a dependency,
  // so we need both variants and pick based on swipe axis
  const animatedStyleH = useAnimatedNumberStyle(translateX, (x) => {
    'worklet'
    const y = translateY.getValue()
    return {
      transform: [{ translateX: x }, { translateY: y }],
    }
  })
  const animatedStyleV = useAnimatedNumberStyle(translateY, (y) => {
    'worklet'
    const x = translateX.getValue()
    return {
      transform: [{ translateX: x }, { translateY: y }],
    }
  })
  const animatedStyle = swipeAxis === 'vertical' ? animatedStyleV : animatedStyleH

  // set drag offset directly (no animation) - used during gesture
  const setDragOffset = useEvent((x: number, y: number) => {
    // cancel any running animation (e.g., spring back from previous gesture)
    cancelAnimationRef.current?.()
    cancelAnimationRef.current = null

    currentOffsetRef.current = { x, y }

    if (useDirectDom && dragRef.current) {
      // direct DOM manipulation for CSS driver
      dragRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
      dragRef.current.style.opacity = '1' // reset in case previous animation faded it
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
  // velocity is in px/ms from gesture, used for smooth momentum continuation
  const animateOut = useEvent(
    (
      direction: 'left' | 'right' | 'up' | 'down',
      velocity?: number,
      onComplete?: () => void
    ) => {
      // cancel any running animation
      cancelAnimationRef.current?.()

      const { x: curX, y: curY } = currentOffsetRef.current

      // ensure exit target is always further than current drag position
      // (user may have dragged past EXIT_DISTANCE already)
      let exitX =
        direction === 'left' ? -EXIT_DISTANCE : direction === 'right' ? EXIT_DISTANCE : 0
      let exitY =
        direction === 'up' ? -EXIT_DISTANCE : direction === 'down' ? EXIT_DISTANCE : 0

      if (direction === 'left' && curX < exitX) exitX = curX - 50
      else if (direction === 'right' && curX > exitX) exitX = curX + 50
      if (direction === 'up' && curY < exitY) exitY = curY - 50
      else if (direction === 'down' && curY > exitY) exitY = curY + 50

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

      // convert velocity from px/ms to px/frame (assuming 60fps = 16.67ms/frame)
      // multiply by ~500 to get a reasonable initial velocity for the spring
      const velocityScale = (velocity ?? 0) * 500
      const initialVelocityX =
        direction === 'left' ? -velocityScale : direction === 'right' ? velocityScale : 0
      const initialVelocityY =
        direction === 'up' ? -velocityScale : direction === 'down' ? velocityScale : 0

      // exit animation config - tuned for smooth momentum continuation
      const exitConfig = {
        damping: 25,
        stiffness: 350,
        mass: 0.4,
        initialVelocityX,
        initialVelocityY,
        fadeOut: true,
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
        // animation driver path (reanimated/RN)
        const springConfig = {
          type: 'spring' as const,
          damping: 25,
          stiffness: 350,
          mass: 0.4,
        }
        translateX.setValue(exitX, springConfig)
        translateY.setValue(exitY, springConfig, () => {
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
