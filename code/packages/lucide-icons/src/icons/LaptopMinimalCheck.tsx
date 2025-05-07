// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path, Rect } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const LaptopMinimalCheck: IconComponent = themed(
  memo(function LaptopMinimalCheck(props: IconProps) {
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
        <Path d="M2 20h20" stroke={color} />
        <Path d="m9 10 2 2 4-4" stroke={color} />
        <Rect x="3" y="4" width="18" height="12" rx="2" stroke={color} />
      </Svg>
    )
  })
)
