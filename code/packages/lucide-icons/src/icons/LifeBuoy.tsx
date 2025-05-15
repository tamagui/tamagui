// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const LifeBuoy: IconComponent = themed(
  memo(function LifeBuoy(props: IconProps) {
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
        <_Circle cx="12" cy="12" r="10" stroke={color} />
        <Path d="m4.93 4.93 4.24 4.24" stroke={color} />
        <Path d="m14.83 9.17 4.24-4.24" stroke={color} />
        <Path d="m14.83 14.83 4.24 4.24" stroke={color} />
        <Path d="m9.17 14.83-4.24 4.24" stroke={color} />
        <_Circle cx="12" cy="12" r="4" stroke={color} />
      </Svg>
    )
  })
)
