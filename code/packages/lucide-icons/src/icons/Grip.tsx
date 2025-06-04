// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Grip: IconComponent = themed(
  memo(function Grip(props: IconProps) {
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
        <_Circle cx="12" cy="5" r="1" stroke={color} />
        <_Circle cx="19" cy="5" r="1" stroke={color} />
        <_Circle cx="5" cy="5" r="1" stroke={color} />
        <_Circle cx="12" cy="12" r="1" stroke={color} />
        <_Circle cx="19" cy="12" r="1" stroke={color} />
        <_Circle cx="5" cy="12" r="1" stroke={color} />
        <_Circle cx="12" cy="19" r="1" stroke={color} />
        <_Circle cx="19" cy="19" r="1" stroke={color} />
        <_Circle cx="5" cy="19" r="1" stroke={color} />
      </Svg>
    )
  })
)
