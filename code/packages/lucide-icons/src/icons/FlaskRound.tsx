// @ts-nocheck
import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const FlaskRound: IconComponent = themed(
  memo(function FlaskRound(props: IconProps) {
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
        <Path d="M10 2v6.292a7 7 0 1 0 4 0V2" stroke={color} />
        <Path d="M5 15h14" stroke={color} />
        <Path d="M8.5 2h7" stroke={color} />
      </Svg>
    )
  })
)
