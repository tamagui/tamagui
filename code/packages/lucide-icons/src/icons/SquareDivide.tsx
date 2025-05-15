// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const SquareDivide: IconComponent = themed(
  memo(function SquareDivide(props: IconProps) {
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
        <Rect width="18" height="18" x="3" y="3" rx="2" ry="2" stroke={color} />
        <Line x1="8" x2="16" y1="12" y2="12" stroke={color} />
        <Line x1="12" x2="12" y1="16" y2="16" stroke={color} />
        <Line x1="12" x2="12" y1="8" y2="8" stroke={color} />
      </Svg>
    )
  })
)
