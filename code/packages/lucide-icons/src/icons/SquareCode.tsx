// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const SquareCode: IconComponent = themed(
  memo(function SquareCode(props: IconProps) {
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
        <Path d="M10 9.5 8 12l2 2.5" stroke={color} />
        <Path d="m14 9.5 2 2.5-2 2.5" stroke={color} />
        <Rect width="18" height="18" x="3" y="3" rx="2" stroke={color} />
      </Svg>
    )
  })
)
