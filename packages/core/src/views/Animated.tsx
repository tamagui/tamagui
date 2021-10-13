import React, { useMemo } from 'react'
import {
  Animated,
  PerpectiveTransform,
  RotateTransform,
  RotateXTransform,
  RotateYTransform,
  RotateZTransform,
  ScaleTransform,
  ScaleXTransform,
  ScaleYTransform,
  SkewXTransform,
  SkewYTransform,
  TranslateXTransform,
  TranslateYTransform,
} from 'react-native'

import { useIsomorphicLayoutEffect } from '../constants/platform'
import { useConstant } from '../hooks/useConstant'
import { StackProps } from '../types'
import { Stack } from './Stack'

const defaultAnimation = {
  from: {
    opacity: 0,
    translateY: 12,
  },
  to: {
    opacity: 1,
    translateY: 0,
  },
}

type AnimatableProps = Partial<
  Pick<StackProps, 'backgroundColor' | 'borderColor' | 'opacity'> &
    PerpectiveTransform &
    RotateTransform &
    RotateXTransform &
    RotateYTransform &
    RotateZTransform &
    ScaleTransform &
    ScaleXTransform &
    ScaleYTransform &
    TranslateXTransform &
    TranslateYTransform &
    SkewXTransform &
    SkewYTransform
>

const styleKeys = {
  opacity: true,
  backgroundColor: true,
  borderColor: true,
}

export type AnimatedStackProps = StackProps & {
  animateState?: 'in' | 'out'
  velocity?: number
  animation?: {
    from: AnimatableProps
    to: AnimatableProps
  }
}

export const AnimatedStack = ({
  animateState = 'in',
  animation = defaultAnimation,
  velocity = 6,
  children,
  animated,
  ...props
}: AnimatedStackProps) => {
  const driver = useConstant(() => {
    return new Animated.Value(0)
  })

  const animatedProps = useMemo(() => {
    if (!animated) {
      return null
    }

    const styleProps = {}
    const transform: any = []

    for (const key in animation.from) {
      const fromVal = animation.from[key]
      const toVal = animation.to[key]
      const interpolatedVal = driver.interpolate({
        inputRange: [0, 1],
        outputRange: [fromVal, toVal],
      })
      if (styleKeys[key]) {
        styleProps[key] = interpolatedVal
      } else {
        transform.push({
          [key]: interpolatedVal,
        })
      }
    }
    return { transform, ...styleProps }
  }, [animated, animateState])

  useIsomorphicLayoutEffect(() => {
    if (!animated) {
      return
    }
    Animated.spring(driver, {
      useNativeDriver: true,
      velocity,
      toValue: animateState === 'in' ? 1 : 0,
    }).start()
  }, [animated, animateState])

  const childrenMemo = useMemo(() => children, [children])

  return (
    // @ts-ignore
    <Stack animated={animated} {...props} {...animatedProps}>
      {childrenMemo}
    </Stack>
  )
}
