// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ClockPlus: IconComponent = themed(
  memo(function ClockPlus(props: IconProps) {
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
        <Path d="M12 6v6l3.644 1.822" stroke={color} />
        <Path d="M16 19h6" stroke={color} />
        <Path d="M19 16v6" stroke={color} />
        <Path d="M21.92 13.267a10 10 0 1 0-8.653 8.653" stroke={color} />
      </Svg>
    )
  })
)
