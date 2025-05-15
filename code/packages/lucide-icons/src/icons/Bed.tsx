// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Bed: IconComponent = themed(
  memo(function Bed(props: IconProps) {
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
        <Path d="M2 4v16" stroke={color} />
        <Path d="M2 8h18a2 2 0 0 1 2 2v10" stroke={color} />
        <Path d="M2 17h20" stroke={color} />
        <Path d="M6 8v9" stroke={color} />
      </Svg>
    )
  })
)
