// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Polyline } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const CornerDownLeft: IconComponent = themed(
  memo(function CornerDownLeft(props: IconProps) {
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
        <Polyline points="9 10 4 15 9 20" stroke={color} />
        <Path d="M20 4v7a4 4 0 0 1-4 4H4" stroke={color} />
      </Svg>
    )
  })
)
