import type { ColorTokens, GetProps, ThemeTokens } from '@tamagui/core'
import {
  createStyledHOC,
  getTokens,
  getVariableValue,
  normalizeColor,
  styled,
  useTheme,
} from '@tamagui/core'
import { YStack } from '@tamagui/stacks'
import type { ViewStyle } from 'react-native'

import type { LinearGradientPoint } from './linear-gradient'
import { LinearGradient as ExpoLinearGradient } from './linear-gradient'

// taken from expo-linear-gradient
export type LinearGradientExtraProps = {
  colors?: (ColorTokens | ThemeTokens | (string & {}))[]
  locations?: number[] | null
  start?: LinearGradientPoint | null
  end?: LinearGradientPoint | null
}

const LinearGradientFrame = styled(YStack, {
  displayName: 'LinearGradient',
  overflow: 'hidden',
  position: 'relative',
})

export const LinearGradient = createStyledHOC(
  LinearGradientFrame,
  (
    propsIn: Omit<GetProps<typeof LinearGradientFrame>, keyof LinearGradientExtraProps> &
      LinearGradientExtraProps,
    ref
  ) => {
    const { start, end, colors: colorsProp, locations, children, ...stackProps } = propsIn
    const theme = useTheme()
    const colorTokens = getTokens().color

    let colors =
      colorsProp?.map((c) => {
        return (theme[c]?.get('web') as string) ?? getVariableValue(colorTokens[c]) ?? c
      }) || []

    if (process.env.NODE_ENV !== 'production') {
      if (
        colors.some((c) => {
          const normalized = normalizeColor(c)
          if (!normalized) {
            return true
          }
        })
      ) {
        console.error(
          `LinearGradient: "colors" prop contains invalid color tokens: ${colors} fallback to default colors: ["#000", "#fff"]`
        )
        colors = ['#000', '#fff']
      }
    }

    return (
      <LinearGradientFrame ref={ref as any} {...stackProps}>
        <ExpoLinearGradient
          start={start}
          end={end}
          colors={colors as any}
          locations={locations as any}
          style={gradientStyle}
        />
        {children}
      </LinearGradientFrame>
    )
  }
)

export type LinearGradientProps = GetProps<typeof LinearGradient>

const gradientStyle: ViewStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
}
