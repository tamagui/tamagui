import type { ColorTokens, ThemeTokens } from '@tamagui/core'
import { useTheme, variableToString } from '@tamagui/core'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import type * as React from 'react'
import { ActivityIndicator } from 'react-native'

export type SpinnerProps = Omit<YStackProps, 'children'> & {
  size?: 'small' | 'large'
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
}

export const Spinner: React.ForwardRefExoticComponent<
  SpinnerProps & React.RefAttributes<any>
> = YStack.styleable((props: SpinnerProps, ref) => {
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
}) as any
