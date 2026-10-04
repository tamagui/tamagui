import { memo, type JSX } from 'react'
import { Svg, Path, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Mail: (props: IconProps) => JSX.Element = themed(
  memo(function Mail(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props as SvgProps & {
      color?: string
      size?: number
    }
    return (
      <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...otherProps}
      >
        <Path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" stroke={color} />
        <Rect x="2" y="4" width="20" height="16" rx="2" stroke={color} />
      </Svg>
    )
  })
)
