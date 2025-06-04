// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const FlaskConicalOff: IconComponent = themed(
  memo(function FlaskConicalOff(props: IconProps) {
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
        <Path d="M10 2v2.343" stroke={color} />
        <Path d="M14 2v6.343" stroke={color} />
        <Path d="m2 2 20 20" stroke={color} />
        <Path
          d="M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563"
          stroke={color}
        />
        <Path d="M6.453 15H15" stroke={color} />
        <Path d="M8.5 2h7" stroke={color} />
      </Svg>
    )
  })
)
