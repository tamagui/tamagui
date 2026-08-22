import type { ColorTokens, ThemeTokens } from '@tamagui/core'
import { createStyledHOC, useTheme, variableToString } from '@tamagui/core'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import { ActivityIndicator } from 'react-native'

type SpinnerExtraProps = {
  size?: 'small' | 'large'
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
}

export type SpinnerProps = Omit<YStackProps, 'children' | keyof SpinnerExtraProps> &
  SpinnerExtraProps

export const Spinner = createStyledHOC(YStack, (props: SpinnerProps, ref) => {
  const { size, color: colorProp, ...stackProps } = props
  const theme = useTheme()
  let color = colorProp as string
  if (color && theme[color]) {
    color = variableToString(theme[color])
  }
  return (
    <YStack ref={ref} {...stackProps}>
      <ActivityIndicator size={size} color={color} />
    </YStack>
  )
})
