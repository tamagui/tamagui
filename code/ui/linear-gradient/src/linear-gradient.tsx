export type { LinearGradientProps, LinearGradientPoint } from 'expo-linear-gradient'
import { normalizeColor } from '@tamagui/core'
import type {
  LinearGradientProps,
  LinearGradientPoint,
  NativeLinearGradientPoint,
} from 'expo-linear-gradient'

// copied from https://raw.githubusercontent.com/expo/expo/main/packages/expo-linear-gradient/src/LinearGradient.web.tsx

import * as React from 'react'
import { View } from 'react-native'

export function LinearGradient({
  colors,
  locations,
  start,
  end,
  ...props
}: LinearGradientProps) {
  const [{ height, width }, setLayout] = React.useState({
    height: 1,
    width: 1,
  })

  const linearGradientBackgroundImage = React.useMemo(() => {
    return getLinearGradientBackgroundImage(
      // @ts-expect-error ok
      colors,
      locations,
      start ? (Array.isArray(start) ? start : [start.x, start.y]) : undefined,
      end ? (Array.isArray(end) ? end : [end.x, end.y]) : undefined,
      width,
      height
    )
  }, [colors, locations, start, end, width, height])

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
