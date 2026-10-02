import { memo, type JSX } from 'react'
import { Svg, Line, Rect, type SvgProps } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const Laptop2: (props: IconProps) => JSX.Element = themed(
  memo(function Laptop2(props: IconProps) {
    const {
      color = 'black',
      size = 24,
      ...otherProps
    } = props as SvgProps & {
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
        <Rect width="18" height="12" x="3" y="4" rx="2" ry="2" stroke={color} />
        <Line x1="2" x2="22" y1="20" y2="20" stroke={color} />
      </Svg>
    )
  })
)
