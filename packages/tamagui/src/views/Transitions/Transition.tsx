// forked from NativeBase
// The MIT License (MIT)

// Copyright (c) 2021 GeekyAnts India Pvt Ltd

// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import React, { forwardRef, useEffect, useMemo, useRef } from 'react'
import { Animated } from 'react-native'

import type { ISupportedTransitions, ITransitionConfig, ITransitionProps } from './types'

const transformStylesMap = {
  translateY: true,
  translateX: true,
  scale: true,
  scaleX: true,
  scaleY: true,
  rotate: true,
}

const defaultStyles = {
  opacity: 1,
  translateY: 0,
  translateX: 0,
  scale: 1,
  scaleX: 1,
  scaleY: 1,
  rotate: '0deg',
}

const getAnimatedStyles = (animateValue: any) => (initial: ISupportedTransitions, to: ISupportedTransitions) => {
  const styles: any = {
    transform: [],
  }
  for (let key in initial) {
    if (key === 'transition') {
      continue
    }

    if (key in transformStylesMap) {
      styles.transform?.push({
        [key]: animateValue.interpolate({
          inputRange: [0, 1],
          outputRange: [(initial as any)[key], (to as any)[key]],
        }),
      } as any)
    } else {
      styles[key] = animateValue.interpolate({
        inputRange: [0, 1],
        outputRange: [(initial as any)[key], (to as any)[key]],
      })
    }
  }

  return styles
}

const defaultTransitionConfig: ITransitionConfig = {
  type: 'timing',
  useNativeDriver: true,
  duration: 250,
  delay: 0,
}

export const Transition = forwardRef(
  (
    {
      children,
      onTransitionComplete,
      visible = false,
      initial,
      animate,
      exit,
      style,
      as,
      ...rest
    }: ITransitionProps,
    ref: any
  ) => {
    const animateValue = useRef(new Animated.Value(0)).current

    const Component = useMemo(() => {
      if (as) {
        return Animated.createAnimatedComponent(as)
      }
      return Animated.View
    }, [as])

    const [animationState, setAnimationState] = React.useState(visible ? 'entering' : 'exited')

    const prevVisible = useRef(visible)

    useEffect(
      function startEntryTransition() {
        const entryTransition = {
          ...defaultTransitionConfig,
          ...animate?.transition,
        }

        if (visible) {
          Animated.sequence([
            // @ts-ignore - delay is present in defaultTransitionConfig
            Animated.delay(entryTransition.delay),
            Animated[entryTransition.type ?? 'timing'](animateValue, {
              toValue: 1,
              useNativeDriver: true,
              ...entryTransition,
            }),
          ]).start(() => {
            setAnimationState('entered')
          })
        }
      },
      [visible, onTransitionComplete, animateValue, animate]
    )

    useEffect(() => {
      // Exit request
      if (prevVisible.current !== visible && !visible) {
        setAnimationState('exiting')
      }
      prevVisible.current = visible
    }, [visible])

    useEffect(
      function startExitTransition() {
        const exitTransition = {
          ...defaultTransitionConfig,
          ...exit?.transition,
        }

        if (animationState === 'exiting') {
          Animated.sequence([
            // @ts-ignore - delay is present in defaultTransitionConfig
            Animated.delay(exitTransition.delay),
            Animated[exitTransition.type ?? 'timing'](animateValue, {
              toValue: 0,
              useNativeDriver: true,
              ...exitTransition,
            }),
          ]).start(() => {
            setAnimationState('exited')
          })
        }
      },
      [exit, onTransitionComplete, setAnimationState, animationState, animateValue]
    )

    // If exit animation is present and state is exiting, we replace 'initial' with 'exit' animation
    initial =
      animationState === 'exiting' && exit ? { ...defaultStyles, ...exit } : { ...defaultStyles, ...initial }

    animate = { ...defaultStyles, ...animate }

    const styles = useMemo(() => {
      return [
        getAnimatedStyles(animateValue)(initial as ISupportedTransitions, animate as ISupportedTransitions),
        style,
      ]
    }, [animateValue, initial, animate, style])

    useEffect(() => {
      if (animationState === 'exited') {
        onTransitionComplete && onTransitionComplete('exited')
      } else if (animationState === 'entered') {
        onTransitionComplete && onTransitionComplete('entered')
      }
    }, [animationState, onTransitionComplete])

    return (
      <Component
        pointerEvents="box-none"
        // https://github.com/facebook/react-native/issues/23090#issuecomment-710803743
        needsOffscreenAlphaCompositing
        style={styles}
        ref={ref}
        {...rest}
      >
        {children}
      </Component>
    )
  }
)
