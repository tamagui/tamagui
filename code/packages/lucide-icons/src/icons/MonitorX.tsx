// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const MonitorX: IconComponent = themed(
  memo(function MonitorX(props: IconProps) {
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
        <Path d="m14.5 12.5-5-5" stroke={color} />
        <Path d="m9.5 12.5 5-5" stroke={color} />
        <Rect width="20" height="14" x="2" y="3" rx="2" stroke={color} />
        <Path d="M12 17v4" stroke={color} />
        <Path d="M8 21h8" stroke={color} />
      </Svg>
    )
  })
)
