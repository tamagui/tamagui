// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const BarChartHorizontalBig: IconComponent = themed(
  memo(function BarChartHorizontalBig(props: IconProps) {
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
        <Path d="M3 3v18h18" stroke={color} />
        <Rect width="12" height="4" x="7" y="5" rx="1" stroke={color} />
        <Rect width="7" height="4" x="7" y="13" rx="1" stroke={color} />
      </Svg>
    )
  })
)
