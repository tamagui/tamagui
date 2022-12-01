import { ColorTokens, ThemeTokens, getVariable, styled, themeable, useTheme } from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { StyleSheet, View } from 'react-native'

import {
  LinearGradient as ExpoLinearGradient,
  LinearGradientProps as ExpoLinearGradientProps,
} from '../lib/linear-gradient'

//
export type LinearGradientProps = Omit<ExpoLinearGradientProps, 'colors'> &
  Omit<YStackProps, 'children' | keyof ExpoLinearGradientProps> & {
    colors?: (ColorTokens | ThemeTokens | (string & {}))[]
  }

export const LinearGradient: React.ForwardRefExoticComponent<
  LinearGradientProps & React.RefAttributes<HTMLElement | View>
> = YStack.extractable(
  themeable(
    React.forwardRef((props: LinearGradientProps, ref) => {
      const { start, end, colors: colorsProp, locations, children, ...stackProps } = props
      const colors = useThemeColors(colorsProp || [])
      return (
        // @ts-ignore
        <LinearGradientFrame ref={ref} {...stackProps}>
          <ExpoLinearGradient
            start={start}
            end={end}
            colors={colors}
            locations={locations}
            style={StyleSheet.absoluteFill}
          >
            {children}
          </ExpoLinearGradient>
        </LinearGradientFrame>
      )
    })
  )
) as any

const LinearGradientFrame = styled(YStack, {
  name: 'LinearGradient',
  overflow: 'hidden',
  position: 'relative',
})

// resolve tamagui theme values
const useThemeColors = (colors: string[]) => {
  const theme = useTheme()
  return colors.map((color) => {
    if (color[0] === '$') {
      return getVariable(theme[color] || color)
    }
    return color
  })
}
