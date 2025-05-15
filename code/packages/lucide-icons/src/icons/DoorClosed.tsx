// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const DoorClosed: IconComponent = themed(
  memo(function DoorClosed(props: IconProps) {
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
        <Path d="M10 12h.01" stroke={color} />
        <Path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" stroke={color} />
        <Path d="M2 20h20" stroke={color} />
      </Svg>
    )
  })
)
