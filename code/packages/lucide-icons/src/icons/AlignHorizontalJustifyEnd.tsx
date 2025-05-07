// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const AlignHorizontalJustifyEnd: IconComponent = themed(
  memo(function AlignHorizontalJustifyEnd(props: IconProps) {
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
        <Rect width="6" height="14" x="2" y="5" rx="2" stroke={color} />
        <Rect width="6" height="10" x="12" y="7" rx="2" stroke={color} />
        <Path d="M22 2v20" stroke={color} />
      </Svg>
    )
  })
)
