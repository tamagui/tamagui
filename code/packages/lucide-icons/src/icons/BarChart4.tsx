import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const BarChart4: IconComponent = themed(
  memo(function BarChart4(props: IconProps) {
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
        <Path d="M3 3v18h18" stroke={color} />
        <Path d="M13 17V9" stroke={color} />
        <Path d="M18 17V5" stroke={color} />
        <Path d="M8 17v-3" stroke={color} />
      </Svg>
    )
  })
)
