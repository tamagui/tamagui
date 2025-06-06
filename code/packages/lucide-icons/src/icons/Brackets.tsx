// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Brackets: IconComponent = themed(
  memo(function Brackets(props: IconProps) {
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
        <Path d="M16 3h2a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-2" stroke={color} />
        <Path d="M8 21H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h2" stroke={color} />
      </Svg>
    )
  })
)
