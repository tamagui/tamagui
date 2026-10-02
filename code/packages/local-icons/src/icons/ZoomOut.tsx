import { memo, type JSX } from 'react'
import { Svg, Circle, Line } from 'react-native-svg'
import { themed, type IconProps } from '@tamagui/helpers-icon'

export const ZoomOut: (props: IconProps) => JSX.Element = themed(
  memo(function ZoomOut(props: IconProps) {
    const { color = 'black', size = 24, ...otherProps } = props
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
        <Circle cx="11" cy="11" r="8" stroke={color} />
        <Line x1="21" x2="16.65" y1="21" y2="16.65" stroke={color} />
        <Line x1="8" x2="14" y1="11" y2="11" stroke={color} />
      </Svg>
    )
  })
)
