import { AnimatePresence, MotiTransitionProp, MotiView } from '@tamagui/animations-moti'
import { LinearGradient } from 'expo-linear-gradient'
// https://github.com/nandorojo/moti/blob/master/packages/moti/src/skeleton/skeleton-new.tsx
import React, { createContext, useContext, useState } from 'react'
import { StyleSheet, View } from 'react-native'

import {
  DEFAULT_SKELETON_SIZE as DEFAULT_SIZE,
  baseColors,
  defaultDarkColors,
  defaultLightColors,
} from './shared'
import { MotiSkeletonProps } from './types'

export default function Skeleton(props: MotiSkeletonProps) {
  const skeletonGroupContext = useContext(SkeletonGroupContext)
  const {
    radius = 8,
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

  const [measuredWidth, setMeasuredWidth] = useState(0)

  const getBorderRadius = () => {
    if (radius === 'square') {
      return 0
    }
    if (radius === 'round') {
      return 99999
    }
    return radius
  }

  const borderRadius = getBorderRadius()

  const getOuterHeight = () => {
    if (boxHeight != null) return boxHeight
    if (show && !children) {
      return height
    }
    return undefined
  }

  const outerHeight = getOuterHeight()

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
      <AnimatePresence>
        {show && (
          <MotiView
            // @ts-expect-error - From Moti, come back to this
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              borderRadius,
              width: width ?? (children ? '100%' : DEFAULT_SIZE),
              height: height ?? '100%',
              overflow: 'hidden',
            }}
            animate={{
              backgroundColor,
              opacity: 1,
            }}
            transition={{
              type: 'timing',
            }}
            exit={
              !disableExitAnimation && {
                opacity: 0,
              }
            }
            onLayout={({ nativeEvent }) => {
              if (measuredWidth === nativeEvent.layout.width) return

              setMeasuredWidth(nativeEvent.layout.width)
            }}
            pointerEvents="none"
          >
            <AnimatedGradient
              // force a key change to make the loop animation re-mount
              key={`${JSON.stringify(colors)}-${measuredWidth}-${JSON.stringify(
                transition || null
              )}`}
              colors={colors}
              backgroundSize={backgroundSize}
              measuredWidth={measuredWidth}
              transition={transition}
            />
          </MotiView>
        )}
      </AnimatePresence>
    </View>
  )
}

const AnimatedGradient = React.memo(
  function AnimatedGradient({
    measuredWidth,
    colors,
    backgroundSize,
    transition = {},
  }: {
    measuredWidth: number
    colors: string[]
    backgroundSize: number
    transition?: MotiTransitionProp
  }) {
    return (
      <MotiView
        style={StyleSheet.absoluteFillObject}
        from={{ opacity: 0 }}
        transition={{
          type: 'timing',
          duration: 200,
        }}
        animate={
          measuredWidth
            ? {
                opacity: 1,
              }
            : undefined
        }
      >
        <MotiView
          style={[
            StyleSheet.absoluteFillObject,
            {
              width: measuredWidth * backgroundSize,
            },
          ]}
          from={{
            translateX: 0,
          }}
          animate={
            measuredWidth
              ? {
                  translateX: -measuredWidth * (backgroundSize - 1),
                }
              : undefined
          }
          transition={{
            loop: true,
            delay: 200,
            type: 'timing',
            duration: 3000,
            ...(transition as any),
          }}
        >
          <LinearGradient
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
      </MotiView>
    )
  },
  function propsAreEqual(prev, next) {
    if (prev.measuredWidth !== next.measuredWidth) return false

    if (prev.backgroundSize !== next.backgroundSize) return false

    const didColorsChange = prev.colors.some((color, index) => {
      return color !== next.colors[index]
    })

    if (didColorsChange) return false

    // transition changes will not be respected, but it'll be in the key
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
