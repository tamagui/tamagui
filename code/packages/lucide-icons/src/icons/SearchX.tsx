// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const SearchX: IconComponent = themed(
  memo(function SearchX(props: IconProps) {
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
        <Path d="m13.5 8.5-5 5" stroke={color} />
        <Path d="m8.5 8.5 5 5" stroke={color} />
        <_Circle cx="11" cy="11" r="8" stroke={color} />
        <Path d="m21 21-4.3-4.3" stroke={color} />
      </Svg>
    )
  })
)
