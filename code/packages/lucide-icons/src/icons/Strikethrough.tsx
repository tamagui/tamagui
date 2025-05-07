// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Line, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Strikethrough: IconComponent = themed(
  memo(function Strikethrough(props: IconProps) {
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
        <Path d="M16 4H9a3 3 0 0 0-2.83 4" stroke={color} />
        <Path d="M14 12a4 4 0 0 1 0 8H6" stroke={color} />
        <Line x1="4" x2="20" y1="12" y2="12" stroke={color} />
      </Svg>
    )
  })
)
