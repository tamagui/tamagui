// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Signal: IconComponent = themed(
  memo(function Signal(props: IconProps) {
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
        <Path d="M2 20h.01" stroke={color} />
        <Path d="M7 20v-4" stroke={color} />
        <Path d="M12 20v-8" stroke={color} />
        <Path d="M17 20V8" stroke={color} />
        <Path d="M22 4v16" stroke={color} />
      </Svg>
    )
  })
)
