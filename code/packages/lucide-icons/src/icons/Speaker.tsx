// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Circle as _Circle, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Speaker: IconComponent = themed(
  memo(function Speaker(props: IconProps) {
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
        <Rect width="16" height="20" x="4" y="2" rx="2" stroke={color} />
        <Path d="M12 6h.01" stroke={color} />
        <_Circle cx="12" cy="14" r="4" stroke={color} />
        <Path d="M12 14h.01" stroke={color} />
      </Svg>
    )
  })
)
