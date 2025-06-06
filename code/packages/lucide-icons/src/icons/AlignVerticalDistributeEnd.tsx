// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const AlignVerticalDistributeEnd: IconComponent = themed(
  memo(function AlignVerticalDistributeEnd(props: IconProps) {
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
        <Rect width="14" height="6" x="5" y="14" rx="2" stroke={color} />
        <Rect width="10" height="6" x="7" y="4" rx="2" stroke={color} />
        <Path d="M2 20h20" stroke={color} />
        <Path d="M2 10h20" stroke={color} />
      </Svg>
    )
  })
)
