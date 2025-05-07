// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const DecimalsArrowLeft: IconComponent = themed(
  memo(function DecimalsArrowLeft(props: IconProps) {
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
        <Path d="m13 21-3-3 3-3" stroke={color} />
        <Path d="M20 18H10" stroke={color} />
        <Path d="M3 11h.01" stroke={color} />
        <Rect x="6" y="3" width="5" height="8" rx="2.5" stroke={color} />
      </Svg>
    )
  })
)
