// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const SaudiRiyal: IconComponent = themed(
  memo(function SaudiRiyal(props: IconProps) {
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
        <Path d="m20 19.5-5.5 1.2" stroke={color} />
        <Path d="M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" stroke={color} />
        <Path d="m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" stroke={color} />
        <Path d="M20 10 4 13.5" stroke={color} />
      </Svg>
    )
  })
)
