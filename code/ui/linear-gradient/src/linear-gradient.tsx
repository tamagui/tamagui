/**
 * Adapted from expo-linear-gradient
 * https://github.com/expo/expo/blob/main/packages/expo-linear-gradient/src/LinearGradient.web.tsx
 *
 * MIT License
 * Copyright (c) 2015-present 650 Industries, Inc. (aka Expo)
 */

import { normalizeColor } from '@tamagui/core'
import type {
  LinearGradientPoint,
  LinearGradientProps,
  NativeLinearGradientPoint,
} from 'expo-linear-gradient'

export type { LinearGradientPoint, LinearGradientProps } from 'expo-linear-gradient'

import * as React from 'react'
import { View } from 'react-native'

// check if start/end points require dimension-aware angle calculation
function needsDimensionAwareAngle(
  start?: NativeLinearGradientPoint | null,
  end?: NativeLinearGradientPoint | null
): boolean {
  // default is top-to-bottom: start [0.5, 0] to end [0.5, 1]
  // for this case (and any case where x values are equal), width doesn't matter
  // we only need onLayout when x values differ AND could create non-standard angles
  if (!start && !end) return false

  const startX = start?.[0] ?? 0.5
  const endX = end?.[0] ?? 0.5

  // if x coordinates are different, angle depends on aspect ratio
  return startX !== endX
}

export function LinearGradient({
  colors,
  locations,
  start,
  end,
  ...props
}: LinearGradientProps) {
  const normalizedStart = start
    ? Array.isArray(start)
      ? start
      : [start.x, start.y]
    : undefined
  const normalizedEnd = end ? (Array.isArray(end) ? end : [end.x, end.y]) : undefined

  const needsLayout = needsDimensionAwareAngle(
    normalizedStart as NativeLinearGradientPoint,
    normalizedEnd as NativeLinearGradientPoint
  )

  const [{ height, width }, setLayout] = React.useState({
    height: 1,
    width: 1,
  })

  const linearGradientBackgroundImage = React.useMemo(() => {
    return getLinearGradientBackgroundImage(
      // @ts-expect-error ok
      colors,
      locations,
      normalizedStart as NativeLinearGradientPoint,
      normalizedEnd as NativeLinearGradientPoint,
      width,
      height
    )
  }, [colors, locations, normalizedStart, normalizedEnd, width, height])

  // if we don't need dimension-aware angles, skip the onLayout overhead
  if (!needsLayout) {
    return (
      <View
        {...props}
        onLayout={props.onLayout}
        style={[
          props.style,
          // @ts-ignore: [ts] Property 'backgroundImage' does not exist on type 'ViewStyle'.
          { backgroundImage: linearGradientBackgroundImage },
        ]}
      />
    )
  }

  return (
    <View
      {...props}
      style={[
        props.style,
        // @ts-ignore: [ts] Property 'backgroundImage' does not exist on type 'ViewStyle'.
        { backgroundImage: linearGradientBackgroundImage },
      ]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout

        setLayout((oldLayout) => {
          // don't set new layout state unless the layout has actually changed
          if (width !== oldLayout.width || height !== oldLayout.height) {
            return { height, width }
          }

          return oldLayout
        })

        if (props.onLayout) {
          props.onLayout(event)
        }
      }}
    />
  )
}

function getLinearGradientBackgroundImage(
  colors: number[] | string[],
  locations?: number[] | null,
  startPoint?: NativeLinearGradientPoint | null,
  endPoint?: NativeLinearGradientPoint | null,
  width = 1,
  height = 1
) {
  const gradientColors = calculateGradientColors(
    // @ts-expect-error TODO fix numbers
    colors,
    locations
  )
  const angle = calculatePseudoAngle(width, height, startPoint, endPoint)
  return `linear-gradient(${angle}deg, ${gradientColors.join(', ')})`
}

function calculatePseudoAngle(
  width: number,
  height: number,
  startPoint?: NativeLinearGradientPoint | null,
  endPoint?: NativeLinearGradientPoint | null
) {
  const getControlPoints = () => {
    let correctedStartPoint: LinearGradientPoint = [0, 0]
    if (Array.isArray(startPoint)) {
      correctedStartPoint = [
        startPoint[0] != null ? startPoint[0] : 0.0,
        startPoint[1] != null ? startPoint[1] : 0.0,
      ]
    }
    let correctedEndPoint: LinearGradientPoint = [0.0, 1.0]
    if (Array.isArray(endPoint)) {
      correctedEndPoint = [
        endPoint[0] != null ? endPoint[0] : 0.0,
        endPoint[1] != null ? endPoint[1] : 1.0,
      ]
    }
    return [correctedStartPoint, correctedEndPoint] as const
  }

  const [start, end] = getControlPoints()
  start[0] *= width
  end[0] *= width
  start[1] *= height
  end[1] *= height
  const py = end[1] - start[1]
  const px = end[0] - start[0]

  return 90 + (Math.atan2(py, px) * 180) / Math.PI
}

function calculateGradientColors(colors: string[], locations?: number[] | null) {
  return colors.map((color: string, index: number): string | void => {
    const output = normalizeColor(color)
    if (locations && locations[index]) {
      const location = Math.max(0, Math.min(1, locations[index]))
      // Convert 0...1 to 0...100
      const percentage = location * 100
      return `${output} ${percentage}%`
    }
    return output
  })
}
