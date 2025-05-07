// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const GalleryHorizontalEnd: IconComponent = themed(
  memo(function GalleryHorizontalEnd(props: IconProps) {
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
        <Path d="M2 7v10" stroke={color} />
        <Path d="M6 5v14" stroke={color} />
        <Rect width="12" height="18" x="10" y="3" rx="2" stroke={color} />
      </Svg>
    )
  })
)
