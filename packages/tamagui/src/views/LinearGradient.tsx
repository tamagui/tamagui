import { ColorTokens, themeable, useTheme } from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { StyleSheet } from 'react-native'

import { LinearGradient as LinearGradientNative, LinearGradientProps } from '../lib/linear-gradient'

// // bugfix esbuild strips react jsx: 'preserve'
React['createElement']

type Props = Omit<LinearGradientProps, 'colors'> &
  Omit<YStackProps, 'children' | keyof LinearGradientProps> & {
    colors?: (ColorTokens | string)[]
  }

export const LinearGradient: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>> =
  YStack.extractable(
    themeable(
      React.forwardRef((props: any, ref) => {
        const { start, end, colors: colorsProp, locations, ...stackProps } = props
        const colors = useLinearGradientColors(colorsProp)
        return (
          <YStack ref={ref} position="relative" overflow="hidden" {...stackProps}>
            <LinearGradientNative
              start={start}
              end={end}
              colors={colors}
              locations={locations}
              style={[StyleSheet.absoluteFill]}
            />
          </YStack>
        )
      })
    )
  ) as any

// resolve tamagui theme values
const useLinearGradientColors = (colors: string[]) => {
  const theme = useTheme()
  return colors.map((color) => {
    if (color[0] === '$') {
      return theme[color]?.toString() || color
    }
    return color
  })
}
