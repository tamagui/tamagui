// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const AlignHorizontalSpaceAround: IconComponent = themed(
  memo(function AlignHorizontalSpaceAround(props: IconProps) {
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
        <Rect width="6" height="10" x="9" y="7" rx="2" stroke={color} />
        <Path d="M4 22V2" stroke={color} />
        <Path d="M20 22V2" stroke={color} />
      </Svg>
    )
  })
)
