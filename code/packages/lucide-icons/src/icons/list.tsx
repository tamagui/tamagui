import { memo } from 'react'
import type { IconProps } from '@tamagui/helpers-icon'
import { Svg, Path } from 'react-native-svg'
import { themed } from '@tamagui/helpers-icon'

type IconComponent = (propsIn: IconProps) => JSX.Element

export const List: IconComponent = themed(
  memo(function List(props: IconProps) {
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
        <Path d="M3 12h.01" stroke={color} />
        <Path d="M3 18h.01" stroke={color} />
        <Path d="M3 6h.01" stroke={color} />
        <Path d="M8 12h13" stroke={color} />
        <Path d="M8 18h13" stroke={color} />
        <Path d="M8 6h13" stroke={color} />
      </Svg>
    )
  })
)
