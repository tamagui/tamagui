// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const PictureInPicture: IconComponent = themed(
  memo(function PictureInPicture(props: IconProps) {
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
        <Path d="M2 10h6V4" stroke={color} />
        <Path d="m2 4 6 6" stroke={color} />
        <Path d="M21 10V7a2 2 0 0 0-2-2h-7" stroke={color} />
        <Path d="M3 14v2a2 2 0 0 0 2 2h3" stroke={color} />
        <Rect x="12" y="14" width="10" height="7" rx="1" stroke={color} />
      </Svg>
    )
  })
)
