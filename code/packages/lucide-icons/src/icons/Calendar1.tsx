// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Calendar1: IconComponent = themed(
  memo(function Calendar1(props: IconProps) {
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
        <Path d="M11 14h1v4" stroke={color} />
        <Path d="M16 2v4" stroke={color} />
        <Path d="M3 10h18" stroke={color} />
        <Path d="M8 2v4" stroke={color} />
        <Rect x="3" y="4" width="18" height="18" rx="2" stroke={color} />
      </Svg>
    )
  })
)
