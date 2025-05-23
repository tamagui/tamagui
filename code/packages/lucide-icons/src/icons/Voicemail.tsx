// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Voicemail: IconComponent = themed(
  memo(function Voicemail(props: IconProps) {
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
        <_Circle cx="6" cy="12" r="4" stroke={color} />
        <_Circle cx="18" cy="12" r="4" stroke={color} />
        <Line x1="6" x2="18" y1="16" y2="16" stroke={color} />
      </Svg>
    )
  })
)
