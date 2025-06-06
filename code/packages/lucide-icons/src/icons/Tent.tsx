// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Tent: IconComponent = themed(
  memo(function Tent(props: IconProps) {
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
        <Path d="M3.5 21 14 3" stroke={color} />
        <Path d="M20.5 21 10 3" stroke={color} />
        <Path d="M15.5 21 12 15l-3.5 6" stroke={color} />
        <Path d="M2 21h20" stroke={color} />
      </Svg>
    )
  })
)
