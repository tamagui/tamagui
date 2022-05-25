import { ColorTokens, themeable, useTheme } from '@tamagui/core'
import { YStack, YStackProps } from '@tamagui/stacks'
import * as React from 'react'
import { ActivityIndicator, StyleSheet } from 'react-native'

// bugfix esbuild strips react jsx: 'preserve'
React['createElement']

export type SpinnerProps = Omit<YStackProps, 'children'> & {
  size?: 'small' | 'large'
  color?: ColorTokens | null
}

export const Spinner: React.ForwardRefExoticComponent<SpinnerProps & React.RefAttributes<any>> =
  YStack.extractable(
    themeable(
      React.forwardRef((props: SpinnerProps, ref) => {
        const { size, color: colorProp, ...stackProps } = props
        const theme = useTheme()
        let color = colorProp as string
        if (color && color[0] === '$') {
          color = theme[color]?.toString()
        }
        return (
          <YStack ref={ref} {...stackProps}>
            <ActivityIndicator size={size} color={color} />
          </YStack>
        )
      })
    )
  ) as any
