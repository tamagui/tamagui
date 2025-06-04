// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const EqualApproximately: IconComponent = themed(
  memo(function EqualApproximately(props: IconProps) {
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
        <Path d="M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" stroke={color} />
        <Path d="M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" stroke={color} />
      </Svg>
    )
  })
)
