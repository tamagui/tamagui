// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Users2: IconComponent = themed(
  memo(function Users2(props: IconProps) {
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
        <Path d="M14 19a6 6 0 0 0-12 0" stroke={color} />
        <_Circle cx="8" cy="9" r="4" stroke={color} />
        <Path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8" stroke={color} />
      </Svg>
    )
  })
)
