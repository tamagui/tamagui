import { themeable, useTheme } from '@tamagui/core'
import {
  LinearGradient as LinearGradientNative,
  LinearGradientProps,
} from '@tamagui/expo-linear-gradient'
import * as React from 'react'
import { StyleSheet } from 'react-native'

import { StackProps, YStack } from './Stacks'

// // bugfix esbuild strips react jsx: 'preserve'
React['createElement']

// TODO type theme values on colors
type Props = LinearGradientProps & Omit<StackProps, 'children' | keyof LinearGradientProps>

export const LinearGradient: React.ForwardRefExoticComponent<Props & React.RefAttributes<any>> =
  YStack.extractable(
    themeable(
      React.forwardRef((props: any, ref) => {
        const { start, end, colors: colorsProp, locations, ...stackProps } = props
        const colors = useLinearGradientColors(colorsProp)
        return (
          <YStack ref={ref} {...props} position="relative" overflow="hidden">
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
  console.log('theme', theme['red10'], theme['$red10'])
  return colors.map((color) => {
    if (color[0] === '$') {
      return theme[color]?.toString() || color
    }
    return color
  })
}
