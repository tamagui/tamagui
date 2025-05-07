// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const ChevronsLeftRightEllipsis: IconComponent = themed(
  memo(function ChevronsLeftRightEllipsis(props: IconProps) {
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
        <Path d="m18 8 4 4-4 4" stroke={color} />
        <Path d="m6 8-4 4 4 4" stroke={color} />
        <Path d="M8 12h.01" stroke={color} />
        <Path d="M12 12h.01" stroke={color} />
        <Path d="M16 12h.01" stroke={color} />
      </Svg>
    )
  })
)
