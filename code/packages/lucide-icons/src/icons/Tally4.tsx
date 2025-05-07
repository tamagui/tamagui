import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const Tally4: IconComponent = themed(
  memo(function Tally4(props: IconProps) {
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
        <Path d="M4 4v16" stroke={color} />
        <Path d="M9 4v16" stroke={color} />
        <Path d="M14 4v16" stroke={color} />
        <Path d="M19 4v16" stroke={color} />
      </Svg>
    )
  })
)
