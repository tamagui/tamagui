import type { ColorTokens, ThemeTokens } from '@tamagui/core'
import { createStyledHOC, useTheme, variableToString } from '@tamagui/core'
import type { YStackProps } from '@tamagui/stacks'
import { YStack } from '@tamagui/stacks'
import * as React from 'react'

type SpinnerExtraProps = {
  size?: 'small' | 'large'
  color?: (ColorTokens | ThemeTokens | (string & {})) | null
}

export type SpinnerProps = Omit<YStackProps, 'children' | keyof SpinnerExtraProps> &
  SpinnerExtraProps

const sizes = {
  small: 20,
  large: 36,
}

/**
 * The same two circles react-native-web draws, at the same sizes and the same
 * 0.75s linear turn, so the web spinner looks like it always has without going
 * through react-native.
 *
 * The turn is driven by the web animations api rather than a keyframe rule: a
 * keyframe would have to reach a stylesheet this package does not own, and the
 * compiled-CSS build strips the one place components can insert rules at
 * runtime.
 */
export const Spinner = createStyledHOC(YStack, (props: SpinnerProps, ref) => {
  const { size = 'small', color: colorProp, ...stackProps } = props
  const theme = useTheme()
  // svg's default stroke is `none`, so an unset color has to land on something.
  // react-native-web's ActivityIndicator picks this same blue
  let color = (colorProp as string) || '#1976D2'
  if (theme[color]) {
    color = variableToString(theme[color])
  }

  const svg = React.useRef<SVGSVGElement>(null)

  React.useEffect(() => {
    const animation = svg.current?.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }],
      { duration: 750, iterations: Number.POSITIVE_INFINITY, easing: 'linear' }
    )
    return () => animation?.cancel()
  }, [])

  const px = sizes[size]

  return (
    <YStack
      ref={ref}
      role="progressbar"
      alignItems="center"
      justifyContent="center"
      {...stackProps}
    >
      <svg ref={svg} width={px} height={px} viewBox="0 0 32 32">
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          strokeWidth="4"
          stroke={color}
          opacity={0.2}
        />
        <circle
          cx="16"
          cy="16"
          r="14"
          fill="none"
          strokeWidth="4"
          stroke={color}
          strokeDasharray={80}
          strokeDashoffset={60}
        />
      </svg>
    </YStack>
  )
})
