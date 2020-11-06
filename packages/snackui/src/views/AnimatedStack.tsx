import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react'
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

import { isWeb } from '../constants'
import { useConstant } from '../hooks/useConstant'
import { StackProps, VStack } from './Stacks'

const defaultAnimation = {
  from: {
    opacity: 0,
    translateY: 30,
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

export const AnimatedVStack = ({
  animateState = 'in',
  animation = defaultAnimation,
  velocity,
  children,
  ...props
}: AnimatedStackProps) => {
  // weird, simple, hacky fast animation for default case
  if (isWeb && animation === defaultAnimation) {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])

    return (
      <VStack
        {...props}
        className={`${props.className ?? ''} animate-in ${
          isMounted ? 'animate-in-mounted' : ''
        }`}
      >
        {children}
      </VStack>
    )
  }

  const driver = useConstant(() => {
    return new Animated.Value(0)
  })

  const animatedProps = useMemo(() => {
    const styleProps = {}
    const transform: any[] = []

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
  }, [animateState])

  useLayoutEffect(() => {
    Animated.spring(driver, {
      useNativeDriver: true,
      velocity,
      toValue: animateState === 'in' ? 1 : 0,
    }).start()
  }, [animateState])

  const childrenMemo = useMemo(() => children, [children])

  return (
    <VStack animated {...props} {...animatedProps}>
      {childrenMemo}
    </VStack>
  )
}
