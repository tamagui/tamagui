// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Sandwich: IconComponent = themed(
  memo(function Sandwich(props: IconProps) {
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
        <Path d="m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777" stroke={color} />
        <Path d="M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25" stroke={color} />
        <Path d="M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9" stroke={color} />
        <Path d="m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" stroke={color} />
        <Rect width="20" height="4" x="2" y="11" rx="1" stroke={color} />
      </Svg>
    )
  })
)
