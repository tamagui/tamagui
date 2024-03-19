import type { ColorTokens, TamaguiElement, ThemeTokens } from '@tamagui/core'
import { themeable, useTheme, variableToString } from '@tamagui/core'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'
import { ActivityIndicator } from 'react-native'

export type SpinnerProps = Omit<YStackProps, 'children'> & {
  size?: 'small' | 'large'
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
}

export const Spinner: React.ForwardRefExoticComponent<
  SpinnerProps & React.RefAttributes<any>
> = YStack.extractable(
  themeable(
    React.forwardRef<TamaguiElement>((props: SpinnerProps, ref) => {
      const { size, color: colorProp, ...stackProps } = props
      const theme = useTheme()
      let color = colorProp as string
      if (color && color[0] === '$') {
        color = variableToString(theme[color])
      }
      return (
        <YStack ref={ref} {...stackProps}>
          <ActivityIndicator size={size} color={color} />
        </YStack>
      )
    }),
    {
      componentName: 'Spinner',
    }
  )
) as any
