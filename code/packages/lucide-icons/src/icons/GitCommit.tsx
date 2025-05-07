// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Line } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const GitCommit: IconComponent = themed(
  memo(function GitCommit(props: IconProps) {
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
        <_Circle cx="12" cy="12" r="3" stroke={color} />
        <Line x1="3" x2="9" y1="12" y2="12" stroke={color} />
        <Line x1="15" x2="21" y1="12" y2="12" stroke={color} />
      </Svg>
    )
  })
)
