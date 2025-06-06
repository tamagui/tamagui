// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Anchor: IconComponent = themed(
  memo(function Anchor(props: IconProps) {
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
        <Path d="M12 22V8" stroke={color} />
        <Path d="M5 12H2a10 10 0 0 0 20 0h-3" stroke={color} />
        <_Circle cx="12" cy="5" r="3" stroke={color} />
      </Svg>
    )
  })
)
