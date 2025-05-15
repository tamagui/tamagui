// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ListCheck: IconComponent = themed(
  memo(function ListCheck(props: IconProps) {
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
        <Path d="M11 18H3" stroke={color} />
        <Path d="m15 18 2 2 4-4" stroke={color} />
        <Path d="M16 12H3" stroke={color} />
        <Path d="M16 6H3" stroke={color} />
      </Svg>
    )
  })
)
