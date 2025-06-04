// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const EyeClosed: IconComponent = themed(
  memo(function EyeClosed(props: IconProps) {
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
        <Path d="m15 18-.722-3.25" stroke={color} />
        <Path d="M2 8a10.645 10.645 0 0 0 20 0" stroke={color} />
        <Path d="m20 15-1.726-2.05" stroke={color} />
        <Path d="m4 15 1.726-2.05" stroke={color} />
        <Path d="m9 18 .722-3.25" stroke={color} />
      </Svg>
    )
  })
)
