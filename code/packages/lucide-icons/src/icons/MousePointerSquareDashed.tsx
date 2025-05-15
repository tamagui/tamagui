// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const MousePointerSquareDashed: IconComponent = themed(
  memo(function MousePointerSquareDashed(props: IconProps) {
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
        <Path d="M5 3a2 2 0 0 0-2 2" stroke={color} />
        <Path d="M19 3a2 2 0 0 1 2 2" stroke={color} />
        <Path d="m12 12 4 10 1.7-4.3L22 16Z" stroke={color} />
        <Path d="M5 21a2 2 0 0 1-2-2" stroke={color} />
        <Path d="M9 3h1" stroke={color} />
        <Path d="M9 21h2" stroke={color} />
        <Path d="M14 3h1" stroke={color} />
        <Path d="M3 9v1" stroke={color} />
        <Path d="M21 9v2" stroke={color} />
        <Path d="M3 14v1" stroke={color} />
      </Svg>
    )
  })
)
