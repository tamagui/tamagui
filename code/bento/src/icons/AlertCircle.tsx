import { memo, type JSX } from 'react'
import { Svg, Circle, Line, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const AlertCircle: (props: IconProps) => JSX.Element = themed(
  memo(function AlertCircle(props: IconProps) {
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
        <Circle cx="12" cy="12" r="10" stroke={color} />
        <Line x1="12" x2="12" y1="8" y2="12" stroke={color} />
        <Line x1="12" x2="12.01" y1="16" y2="16" stroke={color} />
      </Svg>
    )
  })
)
