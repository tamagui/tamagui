// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const SunSnow: IconComponent = themed(
  memo(function SunSnow(props: IconProps) {
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
        <Path d="M10 21v-1" stroke={color} />
        <Path d="M10 4V3" stroke={color} />
        <Path d="M10 9a3 3 0 0 0 0 6" stroke={color} />
        <Path d="m14 20 1.25-2.5L18 18" stroke={color} />
        <Path d="m14 4 1.25 2.5L18 6" stroke={color} />
        <Path d="m17 21-3-6 1.5-3H22" stroke={color} />
        <Path d="m17 3-3 6 1.5 3" stroke={color} />
        <Path d="M2 12h1" stroke={color} />
        <Path d="m20 10-1.5 2 1.5 2" stroke={color} />
        <Path d="m3.64 18.36.7-.7" stroke={color} />
        <Path d="m4.34 6.34-.7-.7" stroke={color} />
      </Svg>
    )
  })
)
