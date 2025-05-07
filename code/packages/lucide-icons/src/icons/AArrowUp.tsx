// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const AArrowUp: IconComponent = themed(
  memo(function AArrowUp(props: IconProps) {
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
        <Path d="M3.5 13h6" stroke={color} />
        <Path d="m2 16 4.5-9 4.5 9" stroke={color} />
        <Path d="M18 16V7" stroke={color} />
        <Path d="m14 11 4-4 4 4" stroke={color} />
      </Svg>
    )
  })
)
