import { MotiTransitionProp, MotiView } from '@tamagui/animations-moti'
// https://github.com/nandorojo/moti/blob/master/packages/moti/src/skeleton/skeleton-new.tsx
import React, { createContext, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated'
import type Animated from 'react-native-reanimated'

import {
  DEFAULT_SKELETON_SIZE as DEFAULT_SIZE,
  baseColors,
  defaultDarkColors,
  defaultLightColors,
} from './shared'
import { MotiSkeletonProps } from './types'
import { Circle, CircleProps, Paragraph, Square, YStack } from 'tamagui'

type InnerCompoentProps = CircleProps & {
  shape?: 'circle' | 'square' | undefined
}

function InnerComponent(props: InnerCompoentProps) {
  const { children, shape, borderRadius = 8, ...rest } = props
  if (shape === 'circle') {
    return <Circle {...rest}>{children}</Circle>
  } else if (shape === 'square') {
    return <Square borderRadius={borderRadius} {...rest}>{children}</Square>
  } else {
    return <YStack borderRadius={borderRadius} {...rest}>{children}</YStack>
  }
}

export default function Skeleton(props: MotiSkeletonProps) {
  const skeletonGroupContext = useContext(SkeletonGroupContext)
  const {
    shape,
    children,
    show = skeletonGroupContext ?? !children,
    width,
    height = children ? undefined : DEFAULT_SIZE,
    boxHeight,
    colorMode = 'dark',
    colors = colorMode === 'dark' ? defaultDarkColors : defaultLightColors,
    backgroundColor = colors[0] ?? colors[1] ?? baseColors[colorMode]?.secondary,
    backgroundSize = 6,
    disableExitAnimation,
    transition,
  } = props

  const measuredWidthSv = useSharedValue(0)


  const outerHeight = (() => {
    if (boxHeight != null) return boxHeight
    if (show && !children) {
      return height
    }
    return undefined
  })()

  return (
    <View
      // @ts-expect-error - From Moti, come back to this
      style={{
        height: outerHeight,
        minHeight: height,
        minWidth: width ?? (children ? undefined : DEFAULT_SIZE),
      }}
    >
      {children}
      <InnerComponent
        position='absolute'
        top={0}
        left={0}
        shape={shape}
        width={width ?? (children ? '100%' : DEFAULT_SIZE)}
        height={height ?? '100%'}
        overflow='hidden'
        backgroundColor={show ? backgroundColor : undefined}
        onLayout={({ nativeEvent }) => {
          if (measuredWidthSv.value !== nativeEvent.layout.width) {
            measuredWidthSv.value = nativeEvent.layout.width
          }
        }}
        pointerEvents="none"
      >
        {disableExitAnimation && !show ? null : (
          <AnimatedGradient
            // force a key change to make the loop animation re-mount
            key={colors.join(',')}
            colors={colors}
            backgroundSize={backgroundSize}
            transition={transition}
            show={show}
            measuredWidthSv={measuredWidthSv}
            Gradient={props.Gradient}
          />
        )}
      </InnerComponent>
    </View >
  )
}

const AnimatedGradient = React.memo(
  function AnimatedGradient({
    colors,
    backgroundSize,
    transition,
    show,
    measuredWidthSv,
    Gradient,
  }: {
    colors: string[]
    backgroundSize: number
    transition?: MotiTransitionProp
    show: boolean
    measuredWidthSv: Animated.SharedValue<number>
  } & Pick<MotiSkeletonProps, 'Gradient'>) {
    return (
      <MotiView
        style={[
          StyleSheet.absoluteFillObject,
          useAnimatedStyle(
            () => ({
              width: measuredWidthSv.value * backgroundSize,
            }),
            [backgroundSize, measuredWidthSv]
          ),
        ]}
        from={{
          opacity: 0,
          translateX: 0,
        }}
        // @ts-expect-error - From Moti, come back to this
        animate={useDerivedValue(() => {
          return {
            opacity: show ? 1 : 0,
            translateX: -measuredWidthSv.value * (backgroundSize - 1),
          }
        }, [measuredWidthSv, show])}
        transition={{
          translateX: {
            type: 'timing',

            loop: show,
            delay: 200,
            duration: 3000,
          },
          opacity: {
            type: 'timing',
            delay: 0,
            duration: 200,
          },
          ...(transition as any),
        }}
      >
        <Gradient
          colors={colors}
          start={{
            x: 0.1,
            y: 1,
          }}
          end={{
            x: 1,
            y: 1,
          }}
          style={StyleSheet.absoluteFillObject}
        />
      </MotiView>
    )
  },
  function propsAreEqual(prev, next) {
    if (prev.backgroundSize !== next.backgroundSize) return false

    if (prev.show !== next.show) return false

    const didColorsChange = prev.colors.some((color, index) => {
      return color !== next.colors[index]
    })

    if (didColorsChange) return false

    // transition changes will not be respected
    return true
  }
)

const SkeletonGroupContext = createContext<boolean | undefined>(undefined)

function SkeletonGroup({
  children,
  show,
}: {
  children: React.ReactNode
  /**
   * If `true`, all `Skeleton` children components will be shown.
   *
   * If `false`, the `Skeleton` children will be hidden.
   */
  show: boolean
}) {
  return (
    <SkeletonGroupContext.Provider value={show}>{children}</SkeletonGroupContext.Provider>
  )
}

Skeleton.Group = SkeletonGroup
