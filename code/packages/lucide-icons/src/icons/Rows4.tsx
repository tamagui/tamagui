// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Rows4: IconComponent = themed(
  memo(function Rows4(props: IconProps) {
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
        <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
        <Path d="M21 7.5H3" stroke={color} />
        <Path d="M21 12H3" stroke={color} />
        <Path d="M21 16.5H3" stroke={color} />
      </Svg>
    )
  })
)
